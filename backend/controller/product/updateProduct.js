const uploadProductPermission = require('../../helpers/permission')
const productModel = require('../../models/productModel')
const redisClient = require("../../config/redisConfig") // 1. Import Redis

async function updateProductController(req,res){
    try{

        if(!uploadProductPermission(req.userId)){
            throw new Error("Permission denied")
        }

        const { _id, ...resBody} = req.body

        const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)
        
        // ----------------------------------------------------
        // 2. CLEAR CACHE (Invalidation)
        // ----------------------------------------------------
        // We check if 'updateProduct' exists (it contains the document BEFORE the update)
        if(updateProduct){
             // Clear the cache for the category this product belongs to
             // So the user sees the new price/name immediately
             const cacheKey = `category_${updateProduct.category}`;
             await redisClient.del(cacheKey);
             console.log(`♻️ Cleared Cache on Update for: ${cacheKey}`);

             // Edge Case: If you CHANGED the category (e.g., moved from 'Mobile' to 'Camera')
             // We should also clear the NEW category's cache
             if(resBody.category && resBody.category !== updateProduct.category){
                 const newCategoryKey = `category_${resBody.category}`;
                 await redisClient.del(newCategoryKey);
                 console.log(`♻️ Cleared Cache for new category: ${newCategoryKey}`);
             }
        }
        // ----------------------------------------------------

        res.json({
            message : "Product update successfully",
            data : updateProduct,
            success : true,
            error : false
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}


module.exports = updateProductController
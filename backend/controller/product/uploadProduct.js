const uploadProductPermission = require("../../helpers/permission")
const productModel = require("../../models/productModel")
const redisClient = require("../../config/redisConfig") // 1. Import Redis

async function UploadProductController(req,res){
    try{
        const sessionUserId = req.userId

        if(!uploadProductPermission(sessionUserId)){
            throw new Error("Permission denied")
        }
    
        const uploadProduct = new productModel(req.body)
        const saveProduct = await uploadProduct.save()

        // ----------------------------------------------------
        // 2. CLEAR CACHE (Invalidation)
        // ----------------------------------------------------
        // We delete the specific category cache so the next request fetches fresh data
        const cacheKey = `category_${saveProduct.category}`;
        
        await redisClient.del(cacheKey); 
        console.log(`🗑️ Cleared Cache for key: ${cacheKey}`);
        // ----------------------------------------------------

        res.status(201).json({
            message : "Product upload successfully",
            error : false,
            success : true,
            data : saveProduct
        })

    }catch(err){
        res.status(400).json({
            message : err.message || err,
            error : true,
            success : false
        })
    }
}

module.exports = UploadProductController
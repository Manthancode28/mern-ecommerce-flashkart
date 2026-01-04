const productModel = require("../../models/productModel")
const redisClient = require("../../config/redisConfig") // Import your new Redis connection

const getCategoryWiseProduct = async(req,res)=>{
    try{
        const { category } = req?.body || req?.query
        
        const cacheKey = `category_${category}`; 
        
        
        const timerLabel = `Category Query Time for ${category}`;
        // console.time(timerLabel); 

        
        const cachedData = await redisClient.get(cacheKey);

        if(cachedData){
            // console.timeEnd(timerLabel); 
            // console.log(`🚀 Cache HIT for ${category}`); 
            // console.log("--------------------")
            
            return res.json({
                data : JSON.parse(cachedData),
                message : "Product (From Cache)",
                success : true,
                error : false
            })
        }

       
        // console.log(`🐢 Cache MISS for ${category}. Fetching from DB...`);
        // console.log("--------------------")
        const product = await productModel.find({ category })
        
        if(product.length > 0){
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(product));
        }

        console.timeEnd(timerLabel); 

        res.json({
            data : product,
            message : "Product (From DB)",
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

module.exports = getCategoryWiseProduct
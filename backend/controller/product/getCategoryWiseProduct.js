const productModel = require("../../models/productModel")
const redisClient = require("../../config/redisConfig") // Import your new Redis connection

const getCategoryWiseProduct = async(req,res)=>{
    try{
        const { category } = req?.body || req?.query
        
        // 1. Create a Unique Key for this category (e.g., "category_mobiles")
        const cacheKey = `category_${category}`; 
        
        // DEBUG: Start timer to measure total time
        const timerLabel = `Category Query Time for ${category}`;
        console.time(timerLabel); 

        // 2. Check Redis Cache first
        // We use 'await' because Redis operations are asynchronous
        const cachedData = await redisClient.get(cacheKey);

        if(cachedData){
            // HIT: Data found in Redis! Return it immediately.
            console.timeEnd(timerLabel); // Stop timer to show speed
            console.log(`🚀 Cache HIT for ${category}`); 
            console.log("--------------------")
            
            return res.json({
                data : JSON.parse(cachedData),
                message : "Product (From Cache)",
                success : true,
                error : false
            })
        }

        // 3. MISS: Data not in Redis. Fetch from MongoDB.
        console.log(`🐢 Cache MISS for ${category}. Fetching from DB...`);
        console.log("--------------------")
        const product = await productModel.find({ category })
        
        // 4. Save to Redis for next time (Expires in 1 hour / 3600 seconds)
        if(product.length > 0){
            await redisClient.setEx(cacheKey, 3600, JSON.stringify(product));
        }

        console.timeEnd(timerLabel); // Stop timer

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
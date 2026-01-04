const redis = require('redis');
require('dotenv').config();

const connectionUrl = process.env.REDIS_URL;

if (!connectionUrl) {
    console.error("🔴 Fatal Error: REDIS_URL is not set.");
}

const redisClient = redis.createClient({ url: connectionUrl });

redisClient.on('error', (err) => {
    console.error("❌ Redis Client Connection Failed (Check URL/Password)");
});

(async () => {
    try {
        await redisClient.connect();
        console.log("🚀 Connected to CLOUD Redis via URL!");
    } catch (err) {
    
    }
})();

module.exports = redisClient;
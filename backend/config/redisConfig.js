const redis = require('redis');
require('dotenv').config(); 

const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.on('error', (err) => console.log('❌ Redis Client Error', err));

(async () => {
    try {
        await redisClient.connect();
        console.log("☁️ Connected to CLOUD Redis Successfully!");
    } catch (err) {
        console.error("❌ Redis Connection Failed:", err);
    }
})();

module.exports = redisClient;
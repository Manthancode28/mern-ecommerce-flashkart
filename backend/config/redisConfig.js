const redis = require('redis');
require('dotenv').config();

const connectionUrl = process.env.REDIS_URL;

if (!connectionUrl) {
    console.error("🔴 Fatal Error: REDIS_URL is not set.");
}

// Create client using the single URL string, which is the most reliable method
const redisClient = redis.createClient({ url: connectionUrl });

redisClient.on('error', (err) => {
    // We log the error but avoid the massive stack trace
    console.error("❌ Redis Client Connection Failed (Check URL/Password)");
});

(async () => {
    try {
        await redisClient.connect();
        console.log("🚀 Connected to CLOUD Redis via URL!");
    } catch (err) {
        // This catch block will hit if the connect fails.
        // The error listener above will handle the logging.
    }
})();

module.exports = redisClient;
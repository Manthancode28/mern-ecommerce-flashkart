const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config()
const connectDB = require('./config/db')
const path = require('path') 
require('./config/redisConfig') 

const router = require('./routes')
const webhooks = require('./controller/order/webhook');

const app = express()
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))

app.post('/api/webhook', express.raw({ type: 'application/json' }), webhooks);

app.use(express.json())
app.use(cookieParser())

app.use("/api",router)


const buildPath = path.resolve(__dirname, '..', 'frontend', 'build');

app.use(express.static(buildPath));


app.get('*', (req, res) => {
    
    res.sendFile(path.join(buildPath, 'index.html'));
});

// ----------------------------------------------------

const PORT = process.env.PORT || 8081;

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log("connnect to DB")
        console.log("Server is running "+PORT)
    })
})
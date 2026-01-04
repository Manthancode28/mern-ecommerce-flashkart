const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path'); 
const http = require('http');
const { Server } = require("socket.io");

require('./config/redisConfig'); 
const router = require('./routes');
const webhooks = require('./controller/order/webhook');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with explicit CORS matching your app
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin : process.env.FRONTEND_URL || "http://localhost:3000",
    credentials : true
}));

app.post('/api/webhook', express.raw({ type: 'application/json' }), webhooks);
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

// Render Static File Logic
const buildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(buildPath));

// ----------------------------------------------------
// SQUAD MODE: ENHANCED REAL-TIME ENGINE
// ----------------------------------------------------
io.on('connection', (socket) => {
    socket.on("join_squad", ({ squadId, userName }) => {
        socket.join(squadId);
        socket.to(squadId).emit("squad_notification", `${userName || "A friend"} joined!`);
    });

    // 📍 Presence Tracking
    socket.on("update_location", ({ squadId, userName, location }) => {
        socket.to(squadId).emit("receive_location_update", { userName, location });
    });

    // 🛒 Cart Mutation Signal
    socket.on("send_cart_update", ({ squadId }) => {
        socket.to(squadId).emit("receive_cart_update");
    });

    // 📺 WebRTC Signaling (For Screen Share)
    socket.on("webrtc_signal", ({ squadId, signal, type }) => {
        // type: 'offer', 'answer', or 'candidate'
        socket.to(squadId).emit("receive_webrtc_signal", { signal, type });
    });

    socket.on("disconnect", () => console.log("User disconnected"));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 8081;

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("✅ DB Connected");
        console.log(`🚀 Server & Socket Hub running on port ${PORT}`);
    });
});
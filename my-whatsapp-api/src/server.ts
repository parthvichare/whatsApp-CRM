import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { socketController } from "./sockets";
import Routes from "./routes/index";
import { WebhookController } from "./controllers/webhookController";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();


// Middleware
app.use(cors({
    origin: "*", // Allow all origins (modify this for production)
    methods: ["GET", "PATCH", "DELETE", "PUT", "POST"],
    credentials: true,
}));
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // URL-encoded bodies

// Create an HTTP server
const server = http.createServer(app);

// Define port
const PORT = process.env.PORT || 8000;

// Initialize Socket.IO with the server
// socketController(server); // Attach the socket controller
const io = socketController(server);
WebhookController.setIoInstance(io);

// Basic Route
app.get("/", (req, res) => {
    res.send("Hello, server is running!");
});

// Attach API routes
app.use("/api", Routes);

// Start the server
server.listen(PORT, () => {
    console.log(`🚀 Server is running on PORT ${PORT}`);
});

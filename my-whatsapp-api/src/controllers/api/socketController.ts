import { Server } from "socket.io";
import { Request, Response } from "express";
import { userInfo } from "os";
import { SalesAgent } from "../../models/salesAgent";

let io: Server | null = null; // Declare io as null initially

// ✅ Initialize Socket.IO
export class SocketController{
    static InitializeSocket(io:Server){
        
    }
}



export const socketController = (server: any): Server => {
    io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        socket.on("fetchUserInfo", async(userId)=>{
            try{
                const userInfo = await SalesAgent.findById(userId)
                console.log(`${userInfo.name} is Connected`)
            }catch(error){
                console.log("Random User Connected")
            }
        })

        socket.on("disconnect", () => {
            console.log(`❌ Client Disconnected: ${socket.id}`);
        });
    });

    return io;
};

// ✅ Get the existing Socket.IO instance
export const getIoInstance = (): Server => {
    if (!io) {
        throw new Error("⚠️ Socket.IO instance is not initialized");
    }
    return io;
};

// ✅ Send Message API Controller
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { to, text } = req.body;

        if (!to || !text) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const messageData = { to, text };
        console.log("🚀 Sending message:", messageData);

        // Ensure Socket.IO is initialized before emitting
        try {
            const ioInstance = getIoInstance();
            ioInstance.emit("receiveMessage", messageData);
            return res.json({ success: true, message: "Message sent successfully" });
        } catch (error) {
            console.error("⚠️ Socket.IO not initialized");
            return res.status(500).json({ error: "Socket.IO not initialized" });
        }
    } catch (error) {
        console.error("❌ Error sending message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

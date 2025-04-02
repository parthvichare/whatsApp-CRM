import { Server, Socket } from "socket.io";
import { SalesAgent } from "../models/salesAgent";
import whatsAppService from "../controllers/services/whatsAppService";
import {registerMessgeHandler} from "./events/messageHandler";

let io: Server | null = null; // Declare io as null initially

export const socketController = (server: any) => {
    if(!io){
        io = new Server(server, { cors: { origin: "*" } }); // Initialize the io instance
        io.on("connection", (socket: Socket) => {
            console.log(`✅ New client connected: ${socket.id}`);
    
            socket.on("fetchUserInfo", async (userId) => {
                try {
                    console.log("Client Connected",userId)
                    // const userInfo = await SalesAgent.findById(userId);
                    // console.log(`${userInfo?.name || "Unknown User"} is Connected`);
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            });
    

            registerMessgeHandler(socket);
    
            // ✅ Handle client disconnect event
            socket.on("disconnect", () => {
                console.log(`❌ Client disconnected: ${socket.id}`);
            });
        });
    
        return io; // Return the io instance
    }
};

// Export a function to get the existing Socket.IO instance
export const getIoInstance = (): Server | null => {
    return io;  // Prevents crashes
};

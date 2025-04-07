import { Server, Socket } from "socket.io";
import { SalesAgent } from "../models/salesAgent";
import whatsAppService from "../controllers/services/whatsAppService";
// import {registerMessgeHandler} from "./events/messageHandler";
import { WebhookController } from "../controllers/webhookController";

let io: Server | null = null; // Declare io as null initially

export const socketController = (server: any) => {
    if(!io){
        io = new Server(server, { cors: { origin: "*" } }); // Initialize the io instance
        io.on("connection", (socket: Socket) => {
            // console.log(`✅ New client connected: ${socket.id}`);
            WebhookController.setIoInstance(io)

    //   socket.on("connect",()=>{
    //     console.log("Socket Connected",socket.id);
    //     dispatch(setSocket(socket))
    //   })

            socket.emit("socketConnected", socket.id);

            console.log("Registering message handlers...");
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



export const registerMessgeHandler =(socket:Socket)=>{
    console.log("Message handler registered for socket:", socket.id);
    socket.on("fetchUserInfo", async (userId) => {
        try {
            console.log("Client Connected",userId)
            // const userInfo = await SalesAgent.findById(userId);
            // console.log(`${userInfo?.name || "Unknown User"} is Connected`);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    });

    socket.on("sendMessage", async(data,callback)=>{
        try{
            console.log("Sending Message", data)
            const {leadPhoneNumber,messageContent,salesAgentId} = data;
            const messageBody={
                leadPhoneNumber,
                messageContent,
            }
            const messageDeliver = await whatsAppService.sendTextMessage(leadPhoneNumber,messageContent,salesAgentId);
            console.log("Message Deliver Successufly")
            socket.emit("messageDelivered",messageDeliver);
        }catch(error){
            callback({ success: false, error: (error as Error).message })
            // socket.emit()
        }
    })
}
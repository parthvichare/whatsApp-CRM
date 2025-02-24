import { Server } from "socket.io";
import { Request, Response } from "express";
import { userInfo } from "os";
import { SalesAgent } from "../models/salesAgent";
import { handleTemplateMessageFlow,handleTextMessageFlow } from "../helper/utils";
import { Messages } from "../models/messageModel";
// import whatsAppMessagingService from "../controllers/services/whatsAppMessagingService";

let io: Server | null = null; // Declare io as null initially

// // ✅ Initialize Socket.IO
// export class SocketController{
//     static InitializeSocket(io:Server){
        
//     }
// }

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

        // socket.emit("sendTextMessage", { leadPhoneNumber, salesAgentId, messagedetails });  -> Frontend Code

        // socket.on("sendTextMessage", async (data) => {
        //     try{
        //         /** Handling Outgoing Text-Messages **/
        //         const { leadPhoneNumber, salesAgentId,messagedetails } = data;

        //         //Use utilsText function
        //         const response = await handleTextMessageFlow(leadPhoneNumber, salesAgentId, messagedetails);
        //         if(response.success){
        //             socket.emit("messageSentSucess", response);
        //         }else{
        //             socket.emit("messageSentError", response);
        //         }
        //         const { conversation } = response.data?.conversation
        //         console.log(`Message sent successfully in conversation: ${conversation.id}`);
        //     }catch(error){
        //         console.error("Socket Error:", error)
        //         socket.emit("messageSentError", {success:false, message:"Internal Server Error"});
        //     }
        // });

        // socket.emit("sendTemplateMessage", { leadPhoneNumber, salesAgentId, messagedetails });  -> Frontend Code
        // socket.on("sendTemplateMessage", async(data)=>{
        //     /** Handling Outgoing Template-Message */
        //     // DEMO = In messageTemplate = {templateId, variables:{product_name,mention_key_benefit,short_description,solve_problem,salesagent_name}}
        //     try{
        //         const{leadPhoneNumber, salesAgentId, messagedetails} = data;

        //         //Use utilsTemplate functions
        //         const result = await handleTemplateMessageFlow(leadPhoneNumber, salesAgentId, messagedetails);
        //         if(!result){
        //             throw new Error("Failed to create or retrieve conversation.");
        //         }
        //         const {conversation} = result
        //         console.log(`Message sent successfully in conversation: ${conversation.id}`);
        //     }catch(error){
        //         console.error(error)
        //     }
        // })

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
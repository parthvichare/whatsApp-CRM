import { Server } from "socket.io";
import { Request, Response } from "express";
import { userInfo } from "os";
import { SalesAgent } from "../models/salesAgent";
import { handleTemplateMessageFlow,handleTextMessageFlow } from "../helper/utils";
import { Messages } from "../models/messageModel";
import whatsAppService from "../controllers/services/whatsAppService";
import { successResponse,successResponseWithData,errorResponse } from "../helper/apiResponse";
// import whatsAppMessagingService from "../controllers/services/whatsAppMessagingService";

let io: Server | null = null; // Declare io as null initially

// // ✅ Initialize Socket.IO
// export class SocketController{
//     static InitializeSocket(io:Server){
        
//     }
// }



// static async sendTextMessage(req: Request, res: Response) {
//     const { leadPhoneNumber,messageContent } = req.body as {
//       leadPhoneNumber?: any;
//       messageContent?: string;
//     };
//     if (!messageContent || !leadPhoneNumber) {
//       return res.status(400).json({ error: "Missing messageContent or receipentNumber" });
//     }

//     const params = {
//       messaging_product: "whatsapp",
//       to: leadPhoneNumber,
//       text: { body: messageContent },
//     };
//     // leadPhoneNumber: number, salesAgentId: string, messagedetails:any

//     try {
//       const response = await axiosInstance.post(
//         `/${process.env.Phone_Number_Id}/messages`,
//         params,
//         { headers }
//       );

//       const messagedetails ={
//         messageContent,
//         messageId: response.data?.messages?.[0]?.id
//       }
      
//       await handleTextMessageFlow(leadPhoneNumber, process.env.SalesAgent_Id, messagedetails);

//       return successResponseWithData(res,"Message Sent Succesfully",response.data)
//     } catch (error) {
//       if(axios.isAxiosError(error) && error.response){
//         const errorMessage = error.response.data?.error?.message || "An error occured";
//         return errorResponse(res, errorMessage)
//     }else{
//         return errorResponse(res,(error as Error).message)
//     }
//     }
//   }

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

        //Socket Connection only for sending Text Message
        socket.on("sendTextMessage", async (data,callback) => {
            try{
                console.log("sending Message",data)
                const{leadPhoneNumber, messageContent} = data
                const success= await whatsAppService.sendTextMessage(leadPhoneNumber,messageContent)
                if (success) {
                    callback({ success: true, message: "Message sent successfully", data });
                }else {
                    callback({ success: false, Error });
                }
            } catch (error) {
                callback({ success: false, error: (error as Error).message });
            }
        });

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
export const getIoInstance = (): Server | null => {
    return io;  // Prevents crashes
};

// // ✅ Send Message API Controller
// export const sendMessage = async (req: Request, res: Response) => {
//     try {
//         const { to, text } = req.body;

//         if (!to || !text) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }

//         const messageData = { to, text };
//         console.log("🚀 Sending message:", messageData);

//         // Ensure Socket.IO is initialized before emitting
//         try {
//             const ioInstance = getIoInstance();
//             ioInstance.emit("receiveMessage", messageData);
//             return res.json({ success: true, message: "Message sent successfully" });
//         } catch (error) {
//             console.error("⚠️ Socket.IO not initialized");
//             return res.status(500).json({ error: "Socket.IO not initialized" });
//         }
//     } catch (error) {
//         console.error("❌ Error sending message:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };
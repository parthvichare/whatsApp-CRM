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
                const{leadPhoneNumber, messageContent,salesAgentId} = data
                const success= await whatsAppService.sendTextMessage(leadPhoneNumber,messageContent,salesAgentId)
                if (success) {
                    callback({ success: true, message: "Message sent successfully", data });
                }else {
                    callback({ success: false, Error });
                }
            } catch (error) {
                callback({ success: false, error: (error as Error).message });
            }
        });

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

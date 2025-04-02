import whatsAppService from "../../controllers/services/whatsAppService";
import { getIoInstance } from "../index"
import { Server, Socket } from "socket.io";

// const io = getIoInstance();

        // // ✅ Handle sendMessage event
        // socket.on("sendMessage", async (data, callback) => {
        //     try {
        //         console.log("📩 Sending Message:", data);
        //         const { leadPhoneNumber, messageContent, salesAgentId } = data;
        //         const success = await whatsAppService.sendTextMessage(leadPhoneNumber, messageContent, salesAgentId);

        //         // callback({ success, message: success ? "Message sent successfully" : "Message failed to send", data });
        //         socket.emit("")
        //     } catch (error) {
        //         callback({ success: false, error: (error as Error).message });
        //         socket.emit("")
        //     }
        // });

export const registerMessgeHandler =(socket:Socket)=>{
    socket.on("sendMessage", async(data,callback)=>{
        try{
            console.log("Sending Message", data)
            const {leadPhoneNumber,messageContent,salesAgentId} = data;
            const success = await whatsAppService.sendTextMessage(leadPhoneNumber,messageContent,salesAgentId);

            const messageBody={
                leadPhoneNumber,
                messageContent,
            }

            socket.emit("newMessage",{messageBody});
        }catch(error){
            callback({ success: false, error: (error as Error).message })
            // socket.emit()
        }
    })
}
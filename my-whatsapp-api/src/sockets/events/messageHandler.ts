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
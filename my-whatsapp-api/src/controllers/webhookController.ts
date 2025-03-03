import { Request, Response } from "express";
import WhatsApp from "whatsapp"; // WhatsApp SDK
import { Messages } from "../models/messageModel";
import whatsAppService from "../controllers/services/whatsAppService";
import { Leads } from "../models/leadModel";
import { Conversations } from "../models/conversationModel";
import { Templates } from "../models/templateModel";
import { UpdateLeadStatus } from "../helper/utils";
import { getIoInstance } from "../sockets/socketHandler"

const io = getIoInstance()

export class WebhookController {
    
    // Handle incoming webhook events from WhatsApp
    static async handleWebhook(req: Request, res: Response) {
        try {
            const data = req.body;
            console.log("Webhook received:", JSON.stringify(data, null, 2)); // Debugging
    
            if (!data.object || !data.entry) {
                return res.status(400).json({ success: false, message: "Invalid Webhook Payload" });
            }
    
            let messagesProcessed: any[] = []; // Store processed messages
    
            for (const entry of data.entry) {
                console.log("Entry:", JSON.stringify(entry, null, 2));
    
                for (const change of entry.changes) {
                    if (!change.value || (!Array.isArray(change.value.messages) && !Array.isArray(change.value.statuses))) {
                        console.error("Error: Neither 'messages' nor 'statuses' found in change");
                        continue;
                    }

                    // Handle Incoming Messages
                    if (Array.isArray(change.value.messages)) {
                        for (const message of change.value.messages) {
                            if (message.from && message.id && message.type) {
                                if(message.type === "text"){
                                    let messageText = {
                                        messageType: message.type,
                                        messageText: message.text ? message.text.body : null,
                                        leadPhoneNumber: message.from,
                                        messageId: message.id
                                    };
                                    await WebhookController.handleIncomingMessage(messageText);
                                    console.log(`Received message from ${message.from}:`, JSON.stringify(messageText, null, 2));
                                }else if(message.type==="button"){
                                    let messageTemplate = {
                                        messageType: message.type,
                                        messageTemplate: message.button? message.button.text: null,
                                        leadPhoneNumber: message.from,
                                        messageId: message.context.id
                                    };
                                    await WebhookController.handleIncomingMessage(messageTemplate);
                                    console.log(`Received message from ${message.from}:`, JSON.stringify(messageTemplate, null, 2));
                                }
    
                                // if (messageEvent.messageText || messageEvent.messageTemplate) {
                                //     await WebhookController.handleIncomingMessage(messageEvent);
                                // }
                            }
                        }
                    }
    
                    // Handle Status Updates
                    if (Array.isArray(change.value.statuses)) {
                        console.log("Statuses detected:", JSON.stringify(change.value.statuses, null, 2));
    
                        for (const status of change.value.statuses) {
                            if (status.id) {
                                const messageStatus = {
                                    messageId: status.id,
                                    messageStatus: status.status ? status.status : "unknow"
                                };
    
                                console.log("Processing Message Status:", messageStatus);
    
                                if (messageStatus.messageStatus) {
                                    await WebhookController.handleMessageStatus(messageStatus);
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Webhook handling error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
    


    // Handle incoming messages
    static async handleIncomingMessage(messagingEvent: any) {
        const{leadPhoneNumber,messageType,messageText,messageTemplate, messageId} =  messagingEvent

        // ✅ Get the Socket.IO instance
        // console.l
        if(io){
            io.emit("leadMessageReceived", {leadPhoneNumber,messageText})
        }

        if(messageTemplate){
            await UpdateLeadStatus(leadPhoneNumber,messageTemplate)
        }
        console.log("Incoming Message",messageTemplate,messageText)
        try{
            const lead =  await Leads.findByPhoneNumber(leadPhoneNumber);
            const conversation = await Conversations.findByLeadId(lead.id)
            const templateDetails:any = await Messages.findByMessageId(messageId)

            if(messageType === "text"){
                console.log("Text")
              const messageData = await Messages.createTextMessage({
                conversationId: conversation.id,
                messageFrom: leadPhoneNumber,
                messageTo: conversation.assignedTo,
                direction: "incoming",
                messageType: messageType,
                messageContent: messageText,
                status: "delivered",
                messageId: messageId
              })
              console.log("Message Stored Successfuly:",messageData)
            }else if(messageType === "button"){
                const messageData = await Messages.createTemplateMessage({
                    conversationId:conversation.id,
                    messageId: messageId,
                    messageFrom : conversation.assignedTo,
                    messageTo : leadPhoneNumber,
                    direction: "incoming",
                    messageType: "template",
                    messageContent : messageTemplate,
                    status: "delivered",
                    templateName: templateDetails.templateName
                })
                console.log("Message Stored Successfuly:",messageData)
            }
            
        }catch(error){
            console.error(error)
        }
    }

    // Handle message status updates
    static async handleMessageStatus(status: any) {
        try {
            const { messageId, messageStatus } = status;
            // Update the message status
            const updated = await Messages.updateMessageStatus(messageId, messageStatus);
        } catch (error) {
            console.error("❌ Error updating message status:", error);
        }
    }
    
    
}

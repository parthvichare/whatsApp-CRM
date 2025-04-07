import { Request, Response } from "express";
import { Messages } from "../models/messageModel";
import { Leads } from "../models/leadModel";
import { Conversations } from "../models/conversationModel";
import { UpdateLeadStatus } from "../helper/utils";
import { getIoInstance } from "../sockets";


export class WebhookController {
    private static io: any = null;

    static setIoInstance(ioInstance: any) {
        WebhookController.io = ioInstance;
        console.log("IO Instance in WebhookController:", WebhookController.io ? "✅ Initialized" : "❌ Not Initialized");
    }
    
    // Handle incoming webhook events from WhatsApp
    static async handleWebhook(req: Request, res: Response) {
        try {
            const data = req.body;
            if (!data.object || !data.entry) {
                return res.status(400).json({ success: false, message: "Invalid Webhook Payload" });
            }

            for (const entry of data.entry) {
                for (const change of entry.changes) {
                    if (!change.value || !Array.isArray(change.value.messages)) {
                        console.error("Error: No valid messages found in change");
                        continue;
                    }
                    await WebhookController.processMessages(change.value.messages);
                }
            }
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error("Webhook handling error:", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }

    // Process incoming messages
    static async processMessages(messages: any[]) {
        for (const message of messages) {
            console.log("Message Received", message);
            if (message.from && message.id && message.type) {
                if (message.type === "text") {
                    await WebhookController.handleTextMessage(message);
                } else if (message.type === "button") {
                    await WebhookController.handleButtonMessage(message);
                }
            }
        }
    }

    // Handle text messages
    static async handleTextMessage(message: any) {
        const messageText = {
            messageType: message.type,
            messageText: message.text ? message.text.body : null,
            leadPhoneNumber: message.from,
            messageId: message.id
        };

        await WebhookController.handleIncomingMessage(messageText);
        console.log(`Received message from ${message.from}:`, JSON.stringify(messageText, null, 2));
    }

    // Handle button messages
    static async handleButtonMessage(message: any) {
        const messageTemplate = {
            messageType: message.type,
            messageTemplate: message.button ? message.button.payload : null,
            leadPhoneNumber: message.from,
            messageId: message.context.id // Use context.id for button response
        };

        await WebhookController.handleIncomingMessage(messageTemplate);
        console.log(`Received button message from ${message.from}:`, JSON.stringify(messageTemplate, null, 2));
    }

    // Handle incoming message logic
    static async handleIncomingMessage(messagingEvent: any) {
        const { leadPhoneNumber, messageType, messageText, messageTemplate, messageId } = messagingEvent;

        if (messageTemplate) {
            await UpdateLeadStatus(leadPhoneNumber, messageTemplate);
        }

        try {
            const lead = await Leads.findByPhoneNumber(leadPhoneNumber);
            const conversation = await Conversations.findByLeadId(lead.id);

            if (messageType === "text") {
                await WebhookController.storeTextMessage(conversation, leadPhoneNumber, messageText, messageId);
            } else if (messageType === "button") {
                await WebhookController.storeButtonMessage(conversation, leadPhoneNumber, messageTemplate, messageId);
            }
        } catch (error) {
            console.error("❌ Error handling incoming message:", error);
        }
    }

    // Store text messages
    static async storeTextMessage(conversation: any, leadPhoneNumber: string, messageText: string, messageId: string) {
        const existingMessage = await Messages.findByMessageId(messageId);
        if (existingMessage) {
            console.log("🚨 MessageId already exists, skipping storage!");
            return;
        }

        const messageData = await Messages.createTextMessage({
            conversationId: conversation.id,
            messageFrom: leadPhoneNumber,
            messageTo: conversation.assignedTo,
            direction: "incoming",
            messageType: "text",
            messageContent: messageText,
            status: "delivered",
            messageId: messageId,
            salesAgentId: conversation.assignedTo
        });
        const incomingMessage = { success: true, message: "Message Sent Successfully", data: messageData }
        WebhookController.io.emit("IncomingMessage", (incomingMessage))
        console.log("✅ Text Message Stored Successfully:", messageData);
    }

    // Store button messages
    static async storeButtonMessage(conversation: any, leadPhoneNumber: string, messageTemplate: string, messageId: string) {
        console.log("Storing Template Messsage")
        const buttonResponseCount = await Messages.countTemplateMessage(messageId);
        console.log(buttonResponseCount)
        if (buttonResponseCount >= 2) {
            console.log("🚨 Limit reached for button responses with MessageId:", messageId);
            return; 
        }

        // const existingMessage = await Messages.findByMessageId(messageId);
        // if (existingMessage) {
        //     console.log("🚨 Template MessageId already exists, skipping storage!");
        //     return;
        // }

        const messageData = await Messages.createTemplateMessage({
            conversationId: conversation.id,
            messageId: messageId,
            messageFrom: leadPhoneNumber,
            messageTo: conversation.assignedTo,
            direction: "incoming",
            messageType: "template",
            messageContent: messageTemplate,
            status: "delivered",
            templateName: messageTemplate, // Ensure you set the template name correctly
            salesAgentId: conversation.assignedTo
        });

        // const incomingMessage = { success: true, message: "Message Sent Successfully", data: messageData }
        // console.log(incomingMessage)
        // WebhookController.io.emit("IncomingMessage", (incomingMessage))
        console.log("✅ Button Response Stored Successfully:", messageData);
    }
}













// import { Request, Response } from "express";
// import WhatsApp from "whatsapp"; // WhatsApp SDK
// import { Messages } from "../models/messageModel";
// import whatsAppService from "../controllers/services/whatsAppService";
// import { Leads } from "../models/leadModel";
// import { Conversations } from "../models/conversationModel";
// import { Templates } from "../models/templateModel";
// import { UpdateLeadStatus } from "../helper/utils";
// import { getIoInstance } from "../sockets/socketHandler"

// const io = getIoInstance()

// export class WebhookController {
    
//     // Handle incoming webhook events from WhatsApp
//     static async handleWebhook(req: Request, res: Response) {
//         try {
//             const data = req.body;
//             // console.log("Webhook received:", JSON.stringify(data, null, 2)); // Debugging
    
//             if (!data.object || !data.entry) {
//                 return res.status(400).json({ success: false, message: "Invalid Webhook Payload" });
//             }
    
//             let messagesProcessed: any[] = []; // Store processed messages
    
//             for (const entry of data.entry) {
//                 // console.log("Entry:", JSON.stringify(entry, null, 2));
    
//                 for (const change of entry.changes) {
//                     if (!change.value || (!Array.isArray(change.value.messages) && !Array.isArray(change.value.statuses))) {
//                         console.error("Error: Neither 'messages' nor 'statuses' found in change");
//                         continue;
//                     }

//                     // Handle Incoming Messages
//                     if (Array.isArray(change.value.messages)) {
//                         console.log('Message', change.value.messages)
//                         for (const message of change.value.messages) {
//                             console.log("Message Received",message)
//                             if (message.from && message.id && message.type) {
//                                 if(message.type === "text"){
//                                     let messageText = {
//                                         messageType: message.type,
//                                         messageText: message.text ? message.text.body : null,
//                                         leadPhoneNumber: message.from,
//                                         messageId: message.id
//                                     };
//                                     await WebhookController.handleIncomingMessage(messageText);
//                                     console.log(`Received message from ${message.from}:`, JSON.stringify(messageText, null, 2));
//                                 }else if(message.type==="button"){
//                                     let messageTemplate = {
//                                         messageType: message.type,
//                                         messageTemplate: message.button? message.button.payload : null,
//                                         leadPhoneNumber: message.from,
//                                         messageId: message.context.id
//                                     };
//                                     await WebhookController.handleIncomingMessage(messageTemplate);
//                                     console.log(`Received message from ${message.from}:`, JSON.stringify(messageTemplate, null, 2));
//                                 }
    
//                                 // if (messageEvent.messageText || messageEvent.messageTemplate) {
//                                 //     await WebhookController.handleIncomingMessage(messageEvent);
//                                 // }
//                             }
//                         }
//                     }
    
//                     // // // Handle Status Updates
//                     // if (Array.isArray(change.value.statuses)) {
//                     //     // console.log("Statuses detected:", JSON.stringify(change.value.statuses, null, 2));
    
//                     //     for (const status of change.value.statuses) {
//                     //         console.log("Status",change.value.statuses )
//                     //         if (status.id) {
//                     //             const messageStatus = {
//                     //                 messageId: status.id,
//                     //                 messageStatus: status.status ? status.status : "unknow"
//                     //             };
    
//                     //             console.log("Processing Message Status:", messageStatus);
    
//                     //             if (messageStatus.messageStatus) {
//                     //                 await WebhookController.handleMessageStatus(messageStatus);
//                     //             }
//                     //         }
//                     //     }
//                     // }
//                 }
//             }
//         } catch (error) {
//             console.error("Webhook handling error:", error);
//             return res.status(500).json({ success: false, message: "Internal Server Error" });
//         }
//     }
    


//     // Handle incoming messages
//     static async handleIncomingMessage(messagingEvent: any) {
//         const{leadPhoneNumber,messageType,messageText,messageTemplate, messageId} =  messagingEvent

//         // const existingMessage = await Messages.findByMessageId(messageId);
//         // if (existingMessage && existingMessage.messageId === messageId) {
//         //     console.log("MessageId already exists, skipping storage!");
//         //     return; // ✅ Prevent further execution if the message exists
//         // }

//         // ✅ Get the Socket.IO instance
//         // console.l
//         if(io){
//             io.emit("leadMessageReceived", {leadPhoneNumber,messageText})
//         }

//         if(messageTemplate){
//             await UpdateLeadStatus(leadPhoneNumber,messageTemplate)
//         }

//         console.log("Incoming Message",messageTemplate,messageText)
//         try{
//             const lead =  await Leads.findByPhoneNumber(leadPhoneNumber);
//             const conversation = await Conversations.findByLeadId(lead.id)
//             const templateDetails:any = await Messages.findByMessageId(messageId)

//             if(messageType === "text"){
//                 console.log("Text")
//               const existingMessage = await Messages.findByMessageId(messageId);
//               if (existingMessage && existingMessage.messageId === messageId) {
//                     console.log("MessageId already exists, skipping storage!");
//                     return; 
//               }else{
//                 const messageData = await Messages.createTextMessage({
//                     conversationId: conversation.id,
//                     messageFrom: leadPhoneNumber,
//                     messageTo: conversation.assignedTo,
//                     direction: "incoming",
//                     messageType: messageType,
//                     messageContent: messageText,
//                     status: "delivered",
//                     messageId: messageId,
//                     salesAgentId:conversation.assignedTo
//                 })
//                 console.log("Message Stored Successfuly:",messageData)
//               }
//             }else if(messageType === "button"){
//                 const buttonResponseCount = await Messages.countTemplateMessage(messageId)
//                 if(buttonResponseCount>=2){
//                     console.log("MessageId already exists, skipping storage!");
//                     return 
//                 }
//                 console.log(buttonResponseCount)
//                 const existingMessage = await Messages.findByMessageId(messageId);
//                 // if (existingMessage && existingMessage.messageId === messageId) {
//                 //       console.log("MessageId already exists, skipping storage!");
//                 //       return; 
//                 // }else{
//                 if(messageTemplate){
//                         const messageData = await Messages.createTemplateMessage({
//                             conversationId:conversation.id,
//                             messageId: messageId,
//                             messageFrom : leadPhoneNumber,
//                             messageTo : conversation.assignedTo,
//                             direction: "incoming",
//                             messageType: "template",
//                             messageContent : messageTemplate,
//                             status: "delivered",
//                             templateName: templateDetails.templateName,
//                             salesAgentId:conversation.assignedTo
//                         })
//                         console.log("Message Stored Successfuly:",messageData)
//                 // }
//                }
//             }
            
//         }catch(error){
//             console.error(error)
//         }
//     }

//     // // Handle message status updates
//     // static async handleMessageStatus(status: any) {
//     //     try {
//     //         const { messageId, messageStatus } = status;
//     //         // Update the message status
//     //         const updated = await Messages.updateMessageStatus(messageId, messageStatus);
//     //     } catch (error) {
//     //         console.error("❌ Error updating message status:", error);
//     //     }
//     // }
    
    
// }


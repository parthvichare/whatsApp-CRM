import { Request, Response } from "express";
import WhatsApp from "whatsapp"; // WhatsApp SDK
import { Messages } from "../models/messageModel";
import whatsAppService from "../controllers/services/whatsAppService";
import { Leads } from "../models/leadModel";
import { Conversations } from "../models/conversationModel";
import { Templates } from "../models/templateModel";
import { UpdateLeadStatus } from "../helper/utils";

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
//                     end-1   |                 "timestamp": "1740646197",
// backend-1   |                 "type": "button",
// backend-1   |                 "button": {
// backend-1   |                   "payload": "No, not at the Moment",
// backend-1   |                   "text": "No, not at the Moment"
// backend-1   |                 }
    
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
                                    messageStatus: status.status ? status.status : "unknown"
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






    // messageType: 'text',
    // messageContent: 'hi',
    // leadPhoneNumber: '919372597458',
    // messageId: 'wamid.HBgMOTE5MzcyNTk3NDU4FQIAEhgWM0VCMEQ2Qzc2QjcyQzhCNDI3RDM4NgA='
        // W
    // messageEvent ={
    //  leadPhoneNumber :
    //  messageText:
    //  messageId : 
    // }

    // const lead= findByPhoneNumber(leadPhoneNumber)
    // const conversation = findByleadId(lead.id)
    






// export const handleIncomingMessages = (req:Request, res: Response) => {
//     const data: WebhookData = req.body;

//     console.log('Incoming Message', JSON.stringify(data,null,2));

//     if(data.object === "whatsapp_business_account"){
//         const changes: Change[] = data.entry[0].changes;
//         changes.forEach((change:Change)=>{
//             const messageData : IncomingMessage[] = change.value.messages
//             if(messageData && messageData.length > 0){
//                 messageData.forEach((message:IncomingMessage)=>{
//                     console.log("Received Message", message.text.body);
//                 })
//             }else{
//                 console.log("No Message Found in change", change)
//             }
//         })
//     }
//     return successResponseWithData(res, "Incoming Message", data)
// }


//Help to differentiate which kind of Incoming Message it is  textMessages or statusofsentMessage
// if(value.messages){
//     console.log("Incoming message from lead:", value.messages);
// }

// if(value.statuses){
//     console.log("Status update for sent message:", value.statuses);
// }




// const handleIncomingMessages = (req: Request, res: Response) => {
//     const data = req.body;
//     console.log('Incoming message:', JSON.stringify(data, null, 2));

//     if (data.object === 'whatsapp_business_account') {
//         const changes = data.entry[0].changes;
//         changes.forEach(change => {
//             const messageData = change.value.messages;
//             if (messageData && messageData.length > 0) {
//                 messageData.forEach(message => {
//                     console.log('Received message:', message.text.body);
//                 });
//             } else {
//                 console.log('No messages found in change:', change);
//             }
//         });
//     }

//     res.status(200).json({status: 'success', message: 'Message processed'});
// };



// app.post("/web-hook", (req, res) => {
//     const data = req.body;

//     // Log the entire incoming data for debugging purposes
//     console.log('Incoming message:', JSON.stringify(data, null, 2)); // Pretty-printing JSON

//     // Access the changes array to get the message details
//     if (data.object === 'whatsapp_business_account') {
//         const changes = data.entry[0].changes;

//         // Loop through the changes to process messages
//         changes.forEach(change => {
//             const messageData = change.value.messages; // Access the messages array
//             if (messageData && messageData.length > 0) {
//                 messageData.forEach(message => {
//                     console.log('Received message:', message.text.body); // Log the message body
//                 });
//             } else {
//                 console.log('No messages found in change:', change);
//             }
//         });
//     }

//     // Always respond with a 200 status code to acknowledge receipt of the message
//     res.status(200).json({status: 'success', message: 'Message processed'});
// });



// //Create & Managing AdsCampaign
// app.get("/web-hook", (req, res) => {
//     const mode = req.query['hub.mode']; // should be 'subscribe'
//     const token = req.query['hub.verify_token']; // your verification token
//     const challenge = req.query['hub.challenge']; // the challenge string

//     // Check if the request is a subscription request
//     if (mode && token) {
//         if (mode === 'subscribe' && token === '1428') { // Replace with your token
//             console.log('Webhook verified');
//             res.status(200).send(challenge); // Respond with the challenge string
//         } else {
//             res.sendStatus(403); // Forbidden
//         }
//     }
// });

// app.post("/web-hook", (req, res) => {
//     const data = req.body;

//     // Log the entire incoming data for debugging purposes
//     console.log('Incoming message:', JSON.stringify(data, null, 2)); // Pretty-printing JSON

//     // Access the changes array to get the message details
//     if (data.object === 'whatsapp_business_account') {
//         const changes = data.entry[0].changes;

//         // Loop through the changes to process messages
//         changes.forEach(change => {
//             const messageData = change.value.messages; // Access the messages array
//             if (messageData && messageData.length > 0) {
//                 messageData.forEach(message => {
//                     console.log('Received message:', message.text.body); // Log the message body
//                 });
//             } else {
//                 console.log('No messages found in change:', change);
//             }
//         });
//     }

//     // Always respond with a 200 status code to acknowledge receipt of the message
//     res.status(200).json({status: 'success', message: 'Message processed'});
// });


















    // static async handleWebhook(req:Request,res:Response){
    //     const data =  req.body
    //     console.log("Webhook Received:", JSON.stringify(data, null, 2));

    //     if(data.object && data.entry){
    //         for(const entry of data.entry){
    //             console.log("Entry:" entry);

    //             if(!entry.changes || !Array.isArray(entry.changes)){
    //                 console.log("Error: Changes property is missing or not an array");
    //                 continue
    //             }

    //             for(const changes of entry.changes){
    //                 console.log("Entry:"change);
    //                 if(!change.value || change.value.messages || !Array.isArray(change.value.message)){
    //                     console.error("Error: message Property is missing or not an array!")
    //                 }
    //             }
    //         }
    //     }
    // }

    
    // W
    // messageEvent ={
    //  leadPhoneNumber :
    //  messageText:
    //  messageId : 
    // }

    // const lead= findByPhoneNumber(leadPhoneNumber)
    // const conversation = findByleadId(lead.id)
    
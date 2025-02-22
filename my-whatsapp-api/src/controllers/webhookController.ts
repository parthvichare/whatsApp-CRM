import { Request, Response } from "express";
import WhatsApp from "whatsapp"; // WhatsApp SDK
import MessageModel from "../models/Message"; // Import your message model
import {whatsAppService} from "../controllers/services/whatsAppService"

const whatsApp = new WhatsApp();

export class WebhookController {
    
    // Handle incoming webhook events from WhatsApp
    static async handleWebhook(req: Request, res: Response) {
        const data = req.body;

        if (data.object && data.entry) {
            for (const entry of data.entry) {
                for (const messagingEvent of entry.messaging) {
                    if (messagingEvent.message) {
                        await this.handleIncomingMessage(messagingEvent);
                    } else if (messagingEvent.status) {
                        await this.handleMessageStatus(messagingEvent);
                    }
                }
            }
            return res.status(200).send("EVENT_RECEIVED");
        }
        return res.status(404).send("EVENT_NOT_FOUND");
    }

    // Handle incoming messages
    static async handleIncomingMessage(messagingEvent: any) {
        const senderId = messagingEvent.sender.id; // Extract sender ID
        const messageText = messagingEvent.message.text; // Extract message content

        console.log("Received message from ${senderId}: ${messageText}");

        // Store the received message in the database
        const newMessage = new MessageModel({
            senderId,
            messageText,
            status: "received",
            timestamp: new Date()
        });

        try {
            await newMessage.save();
            console.log("Message saved to database.");
        } catch (error) {
            console.error("Error saving message to database:", error);
        }

        // Process the message with business logic
        await whatsAppService.getMessage({ senderId, messageText });

        // Auto-reply using WhatsApp SDK
        await whatsAppService.sendMessage(senderId, "You said: ${messageText}");
    }

    // Handle message status updates
    static async handleMessageStatus(messagingEvent: any) {
        const messageId = messagingEvent.status.id;
        const status = messagingEvent.status.status; // Delivered, read, failed, etc.

        // console.log(Message ${messageId} status updated to: ${status});

        // Update the message status in the database
        try {
            await MessageModel.findOneAndUpdate({ _id: messageId }, { status });
            console.log("Message status updated in database.");
        } catch (error) {
            console.error("Error updating message status:", error);
        }
    }
}








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
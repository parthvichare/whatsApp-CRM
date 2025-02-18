import { Request, Response } from "express";
import dotenv from "dotenv";
import {successResponseWithData, errorResponse, notFoundResponse, validationErrorWithData} from  "../../helper/apiResponse"
import { axiosInstance } from "../../helper/utils";
import axios from "axios";


interface IncomingMessage {
    text: {
        body: string;
    }
}

interface Change {
    value: {
        messages: IncomingMessage[];
    }
}

interface Entry{
    changes: Change[];
}

interface WebhookData{
    object: string;
    entry: Entry[];
}



// Create DataBase which stored lead-Details in contact List if its not get stored & Stored Incoming Messages(Messagefrom,messageBody,messageType)
export class webhookController{
    static async handleWebhook(req:Request,res:Response){

    }

    static async handleIncomingMessage(req:Request,res:Response){

    }

    static hanldeMessageStatus(req:Request,res:Response){

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
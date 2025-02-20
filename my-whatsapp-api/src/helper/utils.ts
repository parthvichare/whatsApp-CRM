import { Request, Response } from "express";
import dotenv from "dotenv";
import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../helper/apiResponse";
import axios from "axios";
import { Leads } from "../models/leadModel";
import { Conversations } from "../models/conversationModel";
import { Messages } from "../models/messageModel";
import whatsAppMessagingService from "../controllers/services/whatsAppMessagingService";

dotenv.config({ path: "../../.env" });

interface createLeadConversations{
    salesAgentId:string,
    leadDetails:any
}

export const axiosInstance = axios.create({
    baseURL: `https://graph.facebook.com/${process.env.API_VERSION}/`, // Corrected property name
    timeout: 10000,
});

// Verify Webhook for receiving Incoming Messages on the PhoneNumber!
export const verifyWebhook = async (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    try{
        if(mode && token ){
            if(mode === 'subscribe' && token === '1428'){
                console.log("Webhook Verified")
                return res.status(200).send(challenge);
            }
        }else{
            return notFoundResponse(res,"Webhook not verified")
        }
    }catch(error){
        return errorResponse(res,(error as Error).message); 
    }
};

// Create Lead or Conversation if not available
export const getOrCreateLeadAndConversation = async (leadPhoneNumber: number,salesAgentId: string,messagedetails: any) => {
  try {
    // Find or Create Lead
    let lead = await Leads.findByPhoneNumber(leadPhoneNumber);
    if (!lead) {
      lead = await Leads.create({
        phoneNumber: leadPhoneNumber,
        name: messagedetails.name || "Unknown",
        salesAgentId,
        leadStatus: messagedetails.status || "new",
      });
    }

    //Find or Create Conversation
    let conversation = await Conversations.findByLeadId(lead.id);
    if (!conversation) {
      conversation = await conversation.create({
        leadId: lead.id,
        assignedTo: salesAgentId,
      });
    }
    return { lead, conversation };
  } catch (error) {
    console.error(error);
    return null;
  }
};

//Text Message Handling
export const handleTextMessageFlow = async (leadPhoneNumber: number, salesAgentId: string, messagedetails:any) => {
    try{
        const result = await getOrCreateLeadAndConversation(leadPhoneNumber,salesAgentId,messagedetails);
        if(!result){
            throw new Error("Failed to create or retrieve conversation.");
        }
        const {conversation} = result

        // Store Message and SendMessage In parallel
        await Promise.all([
            Messages.createTextMessage({
                    conversationId: conversation.id,
                    messageFrom: salesAgentId,
                    messageTo: leadPhoneNumber,
                    direction: "outgoing",
                    messageType: "text",
                    messageContent: messagedetails.content,
                    status: messagedetails.status || "send",
                    messageId: messagedetails.id
            }),
            whatsAppMessagingService.sendTextMessage(messagedetails.messsageContent,messagedetails.messageTo)
        ])
    
        return {conversation};
    }catch(error){
        console.error(error);
    }
}


//Template Message Handling
export const handleTemplateMessageFlow = async(leadPhoneNumber: number, salesAgentId: string, messagedetails:any)=>{
    try{
        const result = await getOrCreateLeadAndConversation(leadPhoneNumber,salesAgentId,messagedetails);
        if(!result){
            throw new Error("Failed to create or retrieve conversation.");
        }
        const{conversation} = result

        await Promise.all([
            Messages.createTemplateMessage({
                conversationId:conversation.id,
                messageFrom: salesAgentId,
                messageTo: leadPhoneNumber,
                direction: "outgoing",
                messageType: "template",
                messageContent: messagedetails.content,
                status: messagedetails.status,
                templateName: messagedetails.templateName,
                messageId: messagedetails.id
            }),
            whatsAppMessagingService.sendTemplateMessage(messagedetails.messageTo,messagedetails.content)
        ])
    
        return {conversation};
    }catch(error){
        console.error(error);
    }
}
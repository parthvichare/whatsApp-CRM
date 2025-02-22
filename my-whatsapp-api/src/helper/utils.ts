import { Request, Response } from "express";
import dotenv from "dotenv";
import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../helper/apiResponse";
import axios from "axios";
import { Leads }         from "../models/leadModel";
import { Conversations } from "../models/conversationModel";
import { Messages }      from "../models/messageModel";
import { Templates } from "../models/templateModel";
// import whatsAppMessagingService from "../controllers/services/whatsAppMessagingService";

dotenv.config({ path: "../../.env" });

// console.log(process.env.ACESS_TOKEN)

interface createLeadConversations{
    salesAgentId:string,
    leadDetails:any
}

interface templateDetails{
    templateId:string,
    name:string,
    body:Text,
    parameterName: []
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

// //Text Message Handling
export const handleTextMessageFlow = async (leadPhoneNumber: number, salesAgentId: string, messagedetails:any) => {
    try{
        const result = await getOrCreateLeadAndConversation(leadPhoneNumber,salesAgentId,messagedetails);
        if(!result){
            throw new Error("Failed to create or retrieve conversation.");
        }
        const {conversation} = result

        // const messageResponse = await whatsAppMessagingService.sendTextMessage(messagedetails.messsageContent,messagedetails.messageTo)

        const messageData = await Messages.createTextMessage({
            conversationId: conversation.id,
            messageFrom: salesAgentId,
            messageTo: leadPhoneNumber,
            direction: "outgoing",
            messageType: "text",
            messageContent: messagedetails.messageContent,
            status: messagedetails.status || "send",
            // messageId: messageResponse.id
            messageId: messagedetails.id
        })
        return {success:true, message:"Message Sent Successfully", data:{conversation,messageData}}
    }catch(error){
        if(axios.isAxiosError(error) && error.response){
            return {success:false, message:error.response.data?.error?.message || "WhatsApp API Error"}
        }else{
            return {success:false, message: (error as Error).message}
        }
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
            // whatsAppMessagingService.sendTemplateMessage(messagedetails.messageTo,messagedetails.messageContent)
        ])
    
        return {conversation};
    }catch(error){
        console.error(error);
    }
}

// function extractParameterNames(text) {
//     const paramRegex = /\*?\{\{(.*?)\}\}\*?/g;
//     const matches = [...text.matchAll(paramRegex)];
//     return matches.map(match => match[1]);  // Extract only parameter name
// };

function extractParameterNames(text:string){
    const paramRegex = /\*?{\{(.*?)\}\}\*?/g;
    const matches = [...text.matchAll(paramRegex)];
    return matches.map(match => match[1]);
}

export const extractTemplateDetails = async(templatesData:any) => {
    try{
        return  templatesData.map(async(template:any)=>{
            const templateDetails : any = {
                templateId : template.id,
                templateName: template.name,
                templateBody: JSON.stringify(template.components.find((comp:any)=> comp.type ==="BODY")?.text || ""),
            }
    
            let allTexts: string[] = []
    
            template.components.forEach((component:any)=>{
                if(component.text){
                    allTexts.push(component.text)
                }
            })
    
            const allParameterNames = [...new Set(allTexts.flatMap(text=> extractParameterNames(text)))]
            templateDetails.parameterName = allParameterNames;
            const existingTemplate = await Templates.findOne(templateDetails.templateId)

            if(!existingTemplate){
                await Templates.create(templateDetails)
            }else{
                console.log(`Template with ID ${templateDetails.templateId} alreadyExists`)
            }
    
            return templateDetails;
        })
    }catch(error:any){
        console.error("Error Extracting Template details",error.message)
        return [];
    }
}


export const designTemplateBody = async(templateBody:any) => {
    try{
      const templateDetails = await Templates.findByTemplateName(templateBody.templateName)
      const dataParams = [
        {
          type: "text",
          parameter_name: templateDetails.parameterName[0],
          text: templateBody.parameterValues[0],
        },
        {
          type: "text",
          parameter_name: templateDetails.parameterName[1],
          text: templateBody.parameterValues[1],
        },
        {
          type: "text",
          parameter_name: templateDetails.parameterName[2],
          text: templateBody.parameterValues[2],
        },
        {
          type: "text",
          parameter_name: templateDetails.parameterName[3],
          text: templateBody.parameterValues[3],
        },
        { 
            type: "text", 
            parameter_name: templateDetails.parameterName[4], 
            text: templateBody.parameterValues[4],
        },
      ];
      const payload= {
        messaging_product: "whatsapp",
        to:templateBody.receipentNumber,
        type: "template",
        template:{
            name:templateBody.templateName,
            language: {code:"en"},
            components:[
                {
                  type: "body",
                  parameters: dataParams
                }
            ]
        }
      }
      return payload
    }catch(error:any){
        console.error(error.message)
    }
}
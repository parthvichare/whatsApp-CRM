import { Request, Response } from "express";
import dotenv from "dotenv";
import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../helper/apiResponse";
import axios from "axios";
import { Leads }         from "../models/leadModel";
import { Conversations } from "../models/conversationModel";
import { Messages }      from "../models/messageModel";
import { Templates } from "../models/templateModel";

dotenv.config({ path: "../../.env" });

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
export const getOrCreateLeadAndConversation = async (leadPhoneNumber: string, salesAgentId: string, ) => {
  try {
    // Find or Create Lead
    console.log("leadDetails",leadPhoneNumber,salesAgentId)
    let lead = await Leads.findByPhoneNumber(leadPhoneNumber);
    console.log("Lead", lead)
    if (!lead) {
      lead = await Leads.create({
        phoneNumber: leadPhoneNumber,
        name:  "Unknown",
        salesAgentId:salesAgentId,
        leadStatus: "cold",
      });
    }

    //Find or Create Conversation
    if (lead) {
        console.log("LeadId", lead.id);
    } else {
        console.error("Lead not found or created!");
    }
    let conversation = await Conversations.findByLeadId(lead.id);
    // console.log("Conversation", lead)
    if (!conversation) {
      conversation = await Conversations.create({
        leadId: lead.id,
        assignedTo: salesAgentId,
      });
    }
    console.log("ConversationId created",conversation)
    return { lead, conversation };
  } catch (error) {
    console.error(error);
    return null;
  }
};



// //Text Message Handling
export const handleTextMessageFlow = async (leadPhoneNumber: string, salesAgentId:string, messagedetails:any) => {
    // const result = await getOrCreateLeadAndConversation(leadPhoneNumber,salesAgentId,messageContent);
    console.log("MesageDetails Utils",messagedetails)
    try{
        const result = await getOrCreateLeadAndConversation(leadPhoneNumber,salesAgentId);
        if (!result || !result.conversation){
            throw new Error("Failed to create or retrieve conversation.");
        }
        const {conversation} = result
        console.log("Conversation", conversation.id);
        
        const messageData = await Messages.createTextMessage({
            conversationId: conversation.id,
            messageFrom: salesAgentId,
            messageTo: leadPhoneNumber,
            direction: "outgoing",
            messageType: "text",
            messageContent: messagedetails.messageContent,
            status: "sent",
            messageId: messagedetails.messageId,
            salesAgentId:salesAgentId
        })
        console.log("MessageData", messageData)

        return {success:true, message:"Message Sent Successfully", data:messageData}
    }catch(error){
        if(axios.isAxiosError(error) && error.response){
            return {success:false, message:error.response.data?.error?.message || "WhatsApp API Error"}
        }else{
            return {success:false, message: (error as Error).message}
        }
    }
}


//Template Message Handling
export const handleTemplateMessageFlow = async(
    leadPhoneNumber: string,
    salesAgentId: string, 
    messageDetails:{
        parameterValues:[],
        messageId:string, 
        templateName:string,
        templateBody:string 
    })=>{
    try{
        const result = await getOrCreateLeadAndConversation(leadPhoneNumber,salesAgentId);
        if(!result){
            throw new Error("Failed to create or retrieve conversation.");
        }
        const{conversation} = result

        const messageData= await Messages.createTemplateMessage({
            conversationId:conversation.id,
            messageId: messageDetails.messageId,
            messageFrom : salesAgentId,
            messageTo : leadPhoneNumber,
            direction: "outgoing",
            messageType: "template",
            messageContent : messageDetails.templateBody,
            status: "sent",
            templateName: messageDetails.templateName,
            salesAgentId:salesAgentId
        })
        console.log("Message Data stored successfully",messageData)
    
        return {success:true, message:"Message Sent Successfully", data:{conversation,messageData}}
    }catch(error){
        console.error(error);
    }
}



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
                templateCategory: template.category
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

//Helping to create API request body ready
export const designTemplateBody = async(templateBody:any) => {
    console.log("TemplateBody", templateBody)
    try{
      console.log("Template Body",templateBody)
      const templateDetails = await Templates.findByTemplateName(templateBody.templateName)
      console.log("TemplateDteails", templateDetails)
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
      const phoneNumbers = Object.values(templateBody.leadPhoneNumber);
      console.log("Phone",phoneNumbers)

      const payload = phoneNumbers.map((phoneNumber) => ({
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "template",
        template: {
          name: templateBody.templateName,
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: dataParams,
            },
          ],
        },
       }));
      return {payload,templateDetails}
    }catch(error:any){
        console.error(error.message)
    }
}


export const UpdateLeadStatus=async(leadPhoneNumber:string,messageTemplate:string)=>{
    const lead = await Leads.findByPhoneNumber(leadPhoneNumber)
    console.log(lead)
    if(messageTemplate === "No, not at the Moment" ){
       const updateleadStatus = await Leads.updateLeadStatus(lead.id,"notInterested")
       console.log("updateLeadStatus",updateleadStatus)
    }else if (messageTemplate === "Yes,I loved to Know more"){
        const updateleadStatus = await Leads.updateLeadStatus(lead.id,"hot")
        console.log("updateLeadStatus",updateleadStatus)
    }
}
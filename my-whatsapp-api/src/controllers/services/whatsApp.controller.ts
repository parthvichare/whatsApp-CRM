import { Request, RequestParamHandler, Response } from "express";
import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../../helper/apiResponse";
import axios from "axios";
import { handleTextMessageFlow,handleTemplateMessageFlow } from "../../helper/utils";
import { extractTemplateDetails,designTemplateBody } from "../../helper/utils";


import dotenv from "dotenv";
import { axiosInstance } from "../../helper/utils";
dotenv.config({ path: "../../.env" });


//Update Client Profile Section
const token = process.env.ACCESS_TOKEN

const headers={
    Authorization: `Bearer ${token}`,
    "Content-Type": 'application/json'
}

export default class whatsAppService {
  static async sendTextMessage(leadPhoneNumber: string, messageContent: string, salesAgentId:string) {
    console.log("sendTextMessage", leadPhoneNumber,messageContent,salesAgentId )
    try {
      if (!leadPhoneNumber || !messageContent) {
        return { success: false, error: "Missing messageContent or leadPhoneNumber" };
      }

      const params = {
        messaging_product: "whatsapp",
        to: leadPhoneNumber,
        text: { body: messageContent },
      };

      console.log("Params",params)

      const headers = {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      };

      const response = await axiosInstance.post(
        `/${process.env.Phone_Number_Id}/messages`,
        params,
        { headers }
      );


      const messagedetails = {
        messageContent,
        messageId: response.data?.messages?.[0]?.id || "Unknown",
      };

      const messageData = await handleTextMessageFlow(leadPhoneNumber, salesAgentId, messagedetails);

      return { success: true, message: "Message Sent Successfully", data: messageData.data };
    } catch (error) {
      // ✅ Handle Axios Errors
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error?.message || "An error occurred";
        return { success: false, error: errorMessage };
      }

      return { success: false, error: (error as Error).message };
    }
  }

  static async sendTemplateMessage(req: Request, res: Response) {
    console.log("Template Message")
    try {
      // Get recipient numbers and template details from request body
      const { leadPhoneNumber, templateName, parameterValues, salesAgentId } = req.body;
      console.log(req.body);
  
      if (!leadPhoneNumber) {
        return res.status(400).json({ error: "Missing recipientNumber" });
      }
  
      const templateBody = req.body;
      console.log("Template", templateBody);
  
      // Generate payloads for each number
      const { payload, templateDetails }: any = await designTemplateBody(templateBody);
      console.log("Payloads Generated", payload);
  
      // // ✅ Send messages one by one
      const responses = await Promise.all(
        payload.map(async (singlePayload: any) => {
          try {
            const response = await axiosInstance.post(
              `/${process.env.Phone_Number_Id}/messages`,
              singlePayload,
              { headers }
            );
  
            const messageDetails = {
              parameterValues,
              // messageId: "wamid.HBgMOTE5MzcyNTk3NDU4FQIAERgSMzE3MEY5OUEzNDQ4RUI2NUI3AA==",
              messageId: response.data?.messages?.[0]?.id,
              templateName,
              templateBody: templateDetails.templateBody,
            };
  
            console.log("Message Details", messageDetails);
  
            await handleTemplateMessageFlow(singlePayload.to, salesAgentId, messageDetails);
  
            return { success: true, data: messageDetails };
          } catch (error: any) {
            console.error("Error sending message:", error.response?.data || error.message);
            return { success: false, error: error.response?.data || error.message };
          }
        })
      );
  
      // return successResponseWithData(res, "Messages sent successfully", responses);
    } catch (error: any) {
      console.error("Error in sendTemplateMessage:", error?.response?.data || error.message);
      return res.status(500).json({
        error: "Internal Server Error",
        details: error?.response?.data,
      });
    }
  }

  static async getTemplates(req: Request, res: Response) {
    try {
      const response = await axiosInstance.get(
        `/${process.env.WABAID}/message_templates`,
        { headers }
      );

      const templateDetails = await extractTemplateDetails(response.data.data)
      console.log(templateDetails)

      return successResponseWithData(res, "All Pre-Approved template fetch Successfully", response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage =  error.response.data?.error?.message || "An error occured";
        return errorResponse(res, errorMessage);
      } else {
        return errorResponse(res, (error as Error).message);
      }
    }
  }

  static async billingDetails(req:Request, res:Response){
  }
  
  static async billingofConversation(req:Request, res:Response){
  }
}

  //   try {
  //       // Fetching templates from the database
  //       const templates = await db("templates").select("*");

  //       // Check if the returned array is empty
  //       if (templates.length === 0) {
  //           return res.status(404).json({
  //               success: false,
  //               message: "No templates found",
  //               data: []
  //           });
  //       }
  //       const response = {
  //           success: true,
  //           message: "Fetched data successfully",
  //           responseData: templates 
  //       }
  //       return res.status(200).json(response);
  //     } catch (error) {
  //       console.error("Error fetching templates:", error);
  //       return res.status(500).json({
  //           success: false,
  //           message: "Internal Server Error",
  //           error: error || "Unknown error"
  //       });
  //   }
  // }

  // static async fetchTemplateById(req:Request, res:Response){
  //   try{
  //     const {id}= req.params
  //     const templates = await fetchDataById("templates",id)
  //     const response = {
  //       success: true,
  //       message: "Fetched data successfully",
  //       responseData: templates
  //     }
  //     return res.status(200).json(response);
  //   }catch(error){
  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal Server Error",
  //       error: error || "Unknown error"
  //    });
  //   }
  // }

  // static async storedTemplateData(req:Request,res:Response){
  //   console.log("Storing Template Data")
  //   try{
  //     // const {salesAgentId,templateId,parameterValues} = req.params
  //     const data = req.body
  //     console.log("Template Data",data)
  //     const existingTemplate = await db("templateData")
  //           .where({templateName: data.templateName,salesAgentId:data.salesAgentId})
  //           .first()

  //     console.log("existingTemplate", existingTemplate)

  //     if(existingTemplate){
  //       const updatedTemplateData = await TemplateData.updateTemplateData(existingTemplate.id,data)
  //       return successResponseWithData(res,"Template Already Exist", updatedTemplateData)
  //     }else{
  //       const templates = await TemplateData.templateDataCreate(data)
  //       return successResponseWithData(res,"Message Template Successfully", templates)
  //     }
  //   }catch(error:any){
  //     console.error(
  //       "Error in sendTemplateMessage:",
  //       error?.response?.data || error.message
  //     );
  //     return res
  //       .status(500)
  //       .json({
  //         error: "Internal Server Error",
  //         details: error?.response?.data,
  //       });
  //   }
  // }


  // static async fetchStoredParameterValues(req: Request, res: Response) {
  //   console.log("fetching Parameter Values")
  //   try {
  //       // Fetching templates from the database
  //       const templates = await db("templateData").select("*");

  //       // Check if the returned array is empty
  //       if (templates.length === 0) {
  //           return res.status(404).json({
  //               success: false,
  //               message: "No templates found",
  //               data: []
  //           });
  //       }
  //       const response = {
  //           success: true,
  //           message: "Fetched data successfully",
  //           responseData: templates 
  //       }
  //       return res.status(200).json(response);
  //     } catch (error) {
  //       console.error("Error fetching templates:", error);
  //       return res.status(500).json({
  //           success: false,
  //           message: "Internal Server Error",
  //           error: error || "Unknown error"
  //       });
  //   }
  // }

  // static fetchParameterValuesById=async(req:Request,res:Response)=>{
  //   try{
  //     const {id}= req.params
  //     const templates = await fetchDataById("templateData",id)
  //     const response = {
  //       success: true,
  //       message: "Fetched data successfully",
  //       responseData: templates
  //     }
  //     return res.status(200).json(response);
  //   }catch(error){
  //     return res.status(500).json({
  //       success: false,
  //       message: "Internal Server Error",
  //       error: error || "Unknown error"
  //    });
  //   }
  // }

  // static async updateTemplateData(req: Request, res: Response) {
  //   console.log(req.params);
  //   try {
  //     const { id } = req.params; // ✅ Extract templateData ID from URL
  //     const updateFields = req.body; // ✅ Extract fields to be updated
  
  //     if (!id) {
  //       return res.status(400).json({ error: "Missing templateData ID" });
  //     }
  
  //     const updatedTemplateData = await TemplateData.updateTemplateData(id, updateFields);
  
  //     return successResponseWithData(res, "Message Template Updated Successfully", updatedTemplateData);
  //   } catch (error: any) {
  //     console.error("Error in updateTemplateData:", error?.response?.data || error.message);
  //     return res.status(500).json({
  //       error: "Internal Server Error",
  //       details: error?.response?.data || error.message,
  //     });
  //   }
  // }


  //Sales Agent Leads
  
  
  // static async salesAgentLeads(req:Request,res:Response){
  //   console.log("salesAGentId")
  //   try{
  //     const {salesAgentId} = req.params
  //     if(!salesAgentId){
  //       return res.status(400).json({error:"Missing SalesAgent Id"});
  //     }
  //     const leads =  await Leads.findLeadBySalesagentId(salesAgentId)
  //     const salesAgentLeads = await Promise.all(
  //       leads.map(async (lead: any) => {
  //         const conversation = await Conversations.findByLeadId(lead.id);
  //         return {
  //           leadId: lead.id,
  //           conversationId: conversation?.id || null, // Only return the ID
  //           fullName: lead.name,
  //           phoneNumber: lead.phoneNumber, // Fixed typo
  //           leadStatus: lead.leadStatus,
  //         };
  //       })
  //     );
  //     const response = {
  //       success:true,
  //       message:"Fetched data successfully",
  //       responseData:salesAgentLeads
  //     }
  //     return res.status(200).json(response);
  //   }catch(error:any){
  //     console.error("Error in updateTemplateData:", error?.response?.data || error.message);
  //     return res.status(500).json({
  //       error: "Internal Server Error",
  //       details: error?.response?.data || error.message,
  //     });
  //   }
  // }

  // static async salesAgentChats(req:Request,res:Response){
  //   console.log("sales AgentId")
  //   try{
  //     const {conversationId} = req.params
  //     console.log("Contacts",conversationId)
  //     if(!conversationId){
  //       return res.status(400).json({error:"Missing SalesAgent Id"});
  //     }
  //     // First Check List of Contacts with Respective SalesAgent
  //     const salesAgentChats =  await Messages.findByConversationId(conversationId)
      
  //     const response = {
  //       success:true,
  //       message:"Fetched data successfully",
  //       responseData: salesAgentChats
  //     }
  //     return res.status(200).json(response);
  //   }catch(error:any){
  //     console.error("Error in updateTemplateData:", error?.response?.data || error.message);
  //     return res.status(500).json({
  //       error: "Internal Server Error",
  //       details: error?.response?.data || error.message,
  //     });
  //   }
  // }

  // static async salesAgentProfile(req:Request,res:Response){
  //   console.log("sales AgentId")
  //   try{
  //     const {salesAgentId} =req.params
  //     if(!salesAgentId){
  //       return res.status(400).json({error:"Missing SalesAgent Id"});
  //     }

  //     const salesAgentProfile = await SalesAgent.findById(salesAgentId)
  //     const response = {
  //       success:true,
  //       message:"Fetched data successfully",
  //       responseData: salesAgentProfile
  //     }
  //     return res.status(200).json(response);
  //   }catch(error:any){
  //     console.error("Error in updateTemplateData:", error?.response?.data || error.message);
  //     return res.status(500).json({
  //       error: "Internal Server Error",
  //       details: error?.response?.data || error.message,
  //     });
  //   }
  // }



//Postgres Fetching Data
// updateTemplateData,storedTemplateData,fetchTemplateById,fetchStoredTemplates
// Create controller of the class whatsAppData
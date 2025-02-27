import { Request, Response } from "express";

import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../../helper/apiResponse";
import axios from "axios";
import { Templates } from "../../models/templateModel";
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


const dataParams = {
  template_name: "productmarketing",
  product_name: "AI-Powered CRM",
  mention_key_benefit:
    "streamline your sales and customer management effortlessly.",
  short_description: "intelligent CRM system",
  solve_problem:
    "Automate follow-ups, analyze customer interactions, and improve conversion rates.",
  salesagent_name: "Sarah",
};

console.log(process.env.Phone_Number_Id, process.env.ACCESS_TOKEN);


export default class whatsAppService {
  static async sendTextMessage(req: Request, res: Response) {
    const { leadPhoneNumber,messageContent } = req.body as {
      leadPhoneNumber?: any;
      messageContent?: string;
    };
    if (!messageContent || !leadPhoneNumber) {
      return res.status(400).json({ error: "Missing messageContent or receipentNumber" });
    }

    const params = {
      messaging_product: "whatsapp",
      to: leadPhoneNumber,
      text: { body: messageContent },
    };
    // leadPhoneNumber: number, salesAgentId: string, messagedetails:any

    try {
      const response = await axiosInstance.post(
        `/${process.env.Phone_Number_Id}/messages`,
        params,
        { headers }
      );

      const messagedetails ={
        messageContent,
        messageId: response.data?.messages?.[0]?.id
      }
      
      await handleTextMessageFlow(leadPhoneNumber, process.env.SalesAgent_Id, messagedetails);

      // return successResponseWithData(res,"Message Sent Succesfully",response.data)
      // return {message:"Message Sent Successfully"}
      return {success:true,data:response.data};
    } catch (error) {
      if(axios.isAxiosError(error) && error.response){
        const errorMessage = error.response.data?.error?.message || "An error occured";
        // return errorResponse(res, errorMessage)
        return { success: false, error: errorMessage };
    }
    return { success: false, error: (error as Error).message };
    }
  }

  //   socket.on("newMessage", whatsAppMessagingService.sendTextMessage)
  static async sendTemplateMessage(req: Request, res: Response) {
    try {
      // Get recipient number from request body
      const {
        leadPhoneNumber,
        templateName,
        parameterValues
      } = req.body;
      if (!leadPhoneNumber) {
        return res.status(400).json({ error: "Missing receipentNumber" });
      }

      const templateBody = req.body 
      console.log("Template",templateBody)
      const { payload, templateDetails }:any = await designTemplateBody(templateBody);
      console.log("PayLoadService", payload)
      

      // Send request to WhatsApp API
      const response = await axiosInstance.post(
        `/${process.env.Phone_Number_Id}/messages`,
        payload,
        { headers }
      );

      const messageDetails={
        parameterValues,
        messageId: response.data?.messages?.[0]?.id,
        // messageId:"wamid.HBgMOTE5MzcyNTk3NDU4FQIAERgSNUVBNzYzRTBFMTA0QTI0OTNDAA==",
        templateName,
        templateBody: templateDetails.templateBody
      }

      console.log("Message Details",messageDetails)

      await handleTemplateMessageFlow(leadPhoneNumber,process.env.SalesAgent_Id, messageDetails)

      return successResponseWithData(res,"Message Template Successfully", messageDetails)
    } catch (error: any) {
      console.error(
        "Error in sendTemplateMessage:",
        error?.response?.data || error.message
      );
      return res
        .status(500)
        .json({
          error: "Internal Server Error",
          details: error?.response?.data,
        });
    }
  }

  // static async sendTemplateMessage(req: Request, res: Response) {
  //   try {
  //     // Get recipient number from request body
  //     const {
  //       receipentNumber,
  //       templateName,
  //       parameterValues
  //     } = req.body;
  //     if (!receipentNumber) {
  //       return res.status(400).json({ error: "Missing receipentNumber" });
  //     }

  //     const templateDetails = Templates.findByTemplateName("productmarketing")
  //     console.log(templateDetails);

  //     // Template message parameters
  //     const dataParams = [
  //       {
  //         type: "text",
  //         parameter_name: "product_name",
  //         text: "AI-Powered CRM",
  //       },
  //       {
  //         type: "text",
  //         parameter_name: "mention_key_benefit",
  //         text: "Streamline your sales and customer management effortlessly.",
  //       },
  //       {
  //         type: "text",
  //         parameter_name: "short_description",
  //         text: "Intelligent CRM system",
  //       },
  //       {
  //         type: "text",
  //         parameter_name: "solve_problem",
  //         text: "Automate follow-ups, analyze customer interactions, and improve conversion rates.",
  //       },
  //       { type: "text", parameter_name: "salesagent_name", text: "Sarah" },
  //     ];

  //     // WhatsApp message payload
      // const payload = {
      //   messaging_product: "whatsapp",
      //   to: receipentNumber,
      //   type: "template",
      //   template: {
      //     name: "productmarketing",
      //     language: { code: "en" },
      //     components: [
      //       {
      //         type: "body",
      //         parameters: dataParams,
      //       },
      //     ],
      //   },
      // };

  //     // Send request to WhatsApp API
  //     const response = await axios.post(
  //       `https://graph.facebook.com/v17.0/${process.env.Phone_Number_Id}/messages`,
  //       payload,
  //       { headers }
  //     );

  //     // Check for successful response
  //     if (response.data?.messages) {
  //       return res.status(200).json({
  //         messageId: response.data.messages[0]?.id,
  //         responseData: response.data,
  //       });
  //     }

  //     return res
  //       .status(500)
  //       .json({ error: "Unexpected response from WhatsApp API" });
  //   } catch (error: any) {
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

  static async getMessage(req: Request, res: Response) {
    //Incoming Message stored of each salesAgents
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

  static getTemplateById(req: Request, res: Response) {
  }
}

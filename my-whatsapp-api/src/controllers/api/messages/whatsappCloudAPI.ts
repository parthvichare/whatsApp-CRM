import { Request, Response } from "express";
import { axiosInstance } from "../../../helper/utils";
import {queryTable} from "../../../helper/knexConfig";
import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../../../helper/apiResponse";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });


//Update Client Profile Section
const token = process.env.ACCESS_TOKEN

const headers={
    Authorization: `Bearer ${token}`,
    "Content-Type": 'application/json'
}

/** WorkFlow **/
// Create-Campaign -> Select PreApproved Template -> Select Number of the Lead -> Campaign Goes Live -> Message Sent Using WhatsApp api embedding SalesAgentId for replying  
// -> Hi ABC This is Product details etc etc. Are you Interested? Option=(Yes, No) 
// -> No = Goes Under UnInterested Section
// -> Yes = Goes in hot lead Section -> SalesAgent Replies with Same ConvoId which Created while sending the campaignTemplate -> Message Display to lead 


export const createBusinessProfile =  async(req:Request, res:Response)=>{
    const {messaging_product,address,websites,description,email,vertical} =  req.body
    const params={
        messaging_product,
        address,
        websites,
        description,
        email,
        vertical
    }

    try{
        const response = await axiosInstance.post(`/${process.env.Phone_number_id}/whatsapp_business_profile/`,params,{headers})
        return successResponseWithData(res, " Your Profile Section created Successfully", response.data)
    }catch(error){
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data?.error?.message || "An error occurred";
            console.log("Error message from Graph API:", errorMessage);
            return errorResponse(res, errorMessage);
        } else {
            return errorResponse(res, (error as Error).message);
        }
    }
}

// categoryOptions:- [OTHER, AUTO, BEAUTY, APPAREL, EDU, ENTERTAIN, EVENT_PLAN, FINANCE, GROCERY, GOVT, HOTEL, HEALTH, NONPROFIT, PROF_SERVICES, RETAIL, TRAVEL, RESTAURANT, ALCOHOL, ONLINE_GAMBLING, PHYSICAL_GAMBLING, OTC_DRUGS]

export const editBusinessProfile = async(req:Request,res:Response)=>{

}

export const getBusinessProfileSection = async(req:Request,res:Response)=>{
    try{
        const response =  await axiosInstance.get(`/${process.env.Phone_number_id}/whatsapp_business_profile/`,{
            headers,
            params: {
                fields: "about,address,description,email,profile_picture_url,websites,vertical" // Use params for query parameters
            }
        });
        return successResponseWithData(res,"Business Profile Retrieved Successfully",response.data)
    }catch(error){
        if(axios.isAxiosError(error) && error.response){
            const errorMessage =  error.response.data?.error?.message || "An error occured";
            return errorResponse(res,errorMessage);
        }else{
            return errorResponse(res,(error as Error).message)
        }
    }
}

export const sendTextMessage = async(req:Request, res:Response) => {
    // const {messaging_product,to,type,text} =req.body
    const { messaging_product,to_PhoneNumber, text } = req.body;
    const params={messaging_product,to_PhoneNumber,text}
    // if (to_PhoneNumber not in queryTable.leads){
        // queryTable.leads(name,phoneNumber,)   
    // }

    try{
        //Stored Outgoing message into messageDB to avoid Data Loss while API request
        const newMessage:any = {
            receipent: to_PhoneNumber,
            messageText:text,
            direction: "outgoing",
            status:"delivered"
        }
        const response = await axiosInstance.post(`/${process.env.Phone_number_id}/messages`,params,{headers})
        //MessageId = To stored the messageId to know the status(delievered, read)
        if (response.data?.messages) {
            newMessage.messageId = response.data.messages[0].id; // Store messageId
        }
        console.log(newMessage)
        return successResponseWithData(res,"Message Send Successfully", response.data)
    }catch(error){
        if(axios.isAxiosError(error) && error.response){
            const errorMessage = error.response.data?.error?.message || "An error occured";
            return errorResponse(res, errorMessage)
        }else{
            return errorResponse(res,(error as Error).message)
        }
    }
}

export const sendTemplateByPhoneNumberId = async(req:Request,res:Response)=>{

}

export const getMessagesByPhoneNumberId = async(req:Request, res:Response)=>{

}

export const createCampaign = async(req:Request,res:Response)=>{

}

export const getCampaign = async(req:Request,res:Response)=>{

}

export const getCampaignById = async(req:Request,res:Response)=>{

}

export const deleteCampaignId = async(req:Request,res:Response)=>{

}

export const getCampaignAnalytics = async(req:Request,res:Response)=>{

}














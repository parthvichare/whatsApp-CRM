import { Request, Response } from "express";
import { axiosInstance } from "../helper/utils";
import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../helper/apiResponse";
import axios from "axios";

import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });


//Update Client Profile Section
const token = process.env.ACCESS_TOKEN

const headers={
    Authorization: `Bearer ${token}`,
    "Content-Type": 'application/json'
}

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

export const sendMessageByPhoneNumberId = async(req:Request, res:Response) => {

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







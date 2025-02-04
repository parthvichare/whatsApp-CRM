import { Request, Response } from "express";
import dotenv from "dotenv";
import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../helper/apiResponse";
import { axiosInstance } from "../helper/utils";

dotenv.config({ path: "../../.env" });
const token = process.env.ACCESS_TOKEN

interface AddPhoneNumberResponse {
    id: string; 
}

const headers={
    Authorization: `Bearer ${token}`,
    "Content-Type": 'application/json'
}

export const createWabaId = async(req:Request, res:Response)=>{
    const {whatsBusinessName,currency,business_category}=req.body
    const params={
        whatsBusinessName,
        currency,
        business_category
    }

    try{
        const response  = await axiosInstance.post(`/${process.env.Business_ID}/whatsapp_business_account/`,{headers,params})
        //Stored the whatsApp BusinessId in the clientDetail_DB
        return successResponseWithData(res,"Your WhatsAppBusiness-Id Created Successfully", response)
    }catch(error){
        return errorResponse(res,(error as Error).message);
    }
}

export const addPhoneNumber = async(req:Request,res:Response)=>{
    const{phoneNumber,countryCode,type,verifiedName} =  req.body;
    const params={
        phoneNumber,
        countryCode,
        type,
        verifiedName
    }

    try{
        const response = await axiosInstance.post<AddPhoneNumberResponse>(
            `${process.env.WABAID}`,
            {headers,params}
        );
        const{id} = response.data
        //Stored the phoneNumberId in the clientDetail_DB
        return successResponseWithData(res,"Phone Number Added under the WABAID", {phoneNumberId:id})
    }catch(error){
        return errorResponse(res,(error as Error).message)
    }
}

export const requestOtp = async(req:Request,res:Response)=>{
    const{code_method,language} = req.body
    const params={
        code_method,
        language
    }

    try{
        const response = await axiosInstance.post(
            `${process.env.Phone_Number_ID}/request_code`,
            {headers,params}
        )
        return successResponseWithData(res, "OTP send successfully", response.data)
    }catch(error){
        return errorResponse(res,(error as Error).message)
    }
}

export const verifyOtp =  async(req:Request, res:Response)=>{
    const{code} = req.body
    const params={
        code
    }

    try{
        const response = await axiosInstance.post(
            `${process.env.Phone_Number_ID}/verify_code`,
            {headers,params}
        )
        return successResponseWithData(res,"Your WhatsApp business Number is verified", response.data)
    }catch(error){
        return errorResponse(res,(error as Error).message)
    }
}





// export const getPhoneNumberId = async(req:Request, res:Response)=>{

// }





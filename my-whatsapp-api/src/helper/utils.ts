import { Request, Response } from "express";
import dotenv from "dotenv";
import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../helper/apiResponse";
import axios from "axios";

dotenv.config({ path: "../../.env" });

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

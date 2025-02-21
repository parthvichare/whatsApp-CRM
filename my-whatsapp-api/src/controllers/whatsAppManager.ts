import { Request, Response } from "express";

import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../helper/apiResponse";
import axios from "axios";

import dotenv from "dotenv";
import { axiosInstance } from "../helper/utils";
dotenv.config({ path: "../../.env" });


//Update Client Profile Section
const token = process.env.ACCESS_TOKEN

const headers={
    Authorization: `Bearer ${token}`,
    "Content-Type": 'application/json'
}




// export default class whatsAppManager {
//     static async trackUsage(agentId:string){

//     }

//     static async getConversationAnalytics(agentId:string){

//     }

//     static async addContactNumber(){
        
//     }

//     static async getContactSegments(){

//     }

//     static async getConversationBilling(){

//     }
// }
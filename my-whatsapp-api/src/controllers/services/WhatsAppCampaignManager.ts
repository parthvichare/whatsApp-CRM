import { Request,Response } from "express";
import { AxiosInstance } from "axios";

import{
    successResponseWithData,
    errorResponse
}
from "../../helper/apiResponse";

import axios from "axios";
import dotenv from "dotenv";

dotenv.config({path:"../../.env"});

const token = process.env.ACCESS_TOKEN

const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
}

export class WhatsAppCampaignManager {
    static async sendTemplateMessage(req:Request,res:Response){

    }

    static async createCampaign(req:Request,res:Response){

    }

    static getCampaign(req:Request, res:Response){

    }
}



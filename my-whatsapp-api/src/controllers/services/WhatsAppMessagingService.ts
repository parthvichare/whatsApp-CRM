import WhatsApp from "whatsapp";
import { axiosInstance } from "../../helper/utils";
import dotenv from "dotenv";
import { successResponse, successResponseWithData } from "../../helper/apiResponse";
dotenv.config({ path: "../../.env" });

const whatsApp = new WhatsApp()

// interface MessageBody{
//     leadPhoneNumber:number,
//     messagedetails: any
// }

const token = process.env.ACCESS_TOKEN

const headers={
    Authorization: `Bearer ${token}`,
    "Content-Type": 'application/json'
}



export default class whatsAppMessagingService {
    static async sendTextMessage(req:Request,res:Response) {
        const {message,receipentNumber} = (req.body || {}) as {message?:any, receipentNumber?:number};
        const params={
            message,receipentNumber
        }

        try{
            const response =  await axiosInstance.post("")
        }


    }

    
// socket.on("newMessage", whatsAppMessagingService.sendTextMessage)

    static async sendTemplateMessage(req:Response,res:Response) {
        //SendTemplate Message with templateId
        // const { message, receipentNumber } = req.body; // Get data from request body
        // const params = {message,receipentNumber} 
        // try{
        //     const response = await axiosInstance.post("/api/",params,{headers});
        //     return successResponseWithData(response,"Your WhatsAppBusiness-Id Created Successfully", response.data)
        // }

    }

    static async getMessage(req: Request, res: Response) {
        //Incoming Message stored of each salesAgents
    }

    static getCampaign(req: Request, res: Response) {

    }
}

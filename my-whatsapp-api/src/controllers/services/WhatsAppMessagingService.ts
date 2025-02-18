import WhatsApp from "whatsapp";

const whatsApp  = new WhatsApp()


export class whatsAppMessagingService {
    static async sendTextMessage(req:Request, res:Response){
        //OutgoingMessage
    }

    static async getMessage(req:Request, res:Response){
        //Incoming Message stored of each salesAgents
    }
}
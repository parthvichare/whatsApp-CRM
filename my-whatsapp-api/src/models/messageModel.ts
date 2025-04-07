import { queryTable,selectFromTable,updateTable } from "../helper/knexConfig";

const TABLE_NAME = 'messages';

export class Messages {
    static async createTextMessage(data: {
        conversationId:string,
        messageId:any,
        messageFrom:string,
        messageTo:number,
        direction:'incoming' | 'outgoing',
        messageType: 'text'|'template',
        messageContent:string,
        salesAgentId:string,
        status: 'sent'|'delivered' | 'read' | "received"
    }){
        await queryTable(TABLE_NAME, {
            ...data,
            conversationId: data.conversationId,
            status: data.status || 'sent',
        });  
        const result =   await selectFromTable(TABLE_NAME,"*",{messageId: data.messageId})
        return result.length? result[0]: null
    }

    static async createTemplateMessage(data: {
        conversationId:string,
        messageId:string,
        messageFrom:string,
        messageTo:number,
        direction:'incoming' | 'outgoing',
        messageType: 'text'|'template',
        messageContent:string,
        status: 'sent'|'delivered' | 'read',
        templateName: string,
        salesAgentId:string,
    }){
        return queryTable(TABLE_NAME, {
            ...data,
            conversationId: data.conversationId,
            status: data.status || 'sent',
        });     
    }

    static async findByConversationId(conversationId:string){
        const result = await selectFromTable(TABLE_NAME, "*", {conversationId});
        return result
    }

    static async findByMessageId(messageId:string){
        const result = await selectFromTable(TABLE_NAME,"*", {messageId});
        console.log("All Message",result)
        return result.length ? result[0] : null
    }

    static async updateMessageStatus(messageStatus: string,messageId: string) {
        console.log("Message Updating", messageId)
        try {
            // Update the message status in the database
            const result = await updateTable(TABLE_NAME, { status: messageStatus }, { messageId});
    
            return result > 0; // Returns true if update was successful
        } catch (error) {
            console.error("❌ Error updating message status:", error);
            return false;
        }
    }

    static async findChatsBySalesAgentId(salesAgentId:string){
        const result = await selectFromTable(TABLE_NAME, "*", {salesAgentId});
        return result.length ? result : null;
    }

    static async countTemplateMessage(messageId:string){
        const count = await selectFromTable(TABLE_NAME,"*",{messageId});
        console.log("Length",count.length)
        return count.length
    }
    
}


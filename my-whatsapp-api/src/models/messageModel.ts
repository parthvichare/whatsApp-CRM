import { queryTable,selectFromTable } from "../helper/knexConfig";

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
        status: 'send'|'delivered' | 'read'
    }){
        return queryTable(TABLE_NAME, {
            ...data,
            conversationId: data.conversationId,
            status: data.status || 'sent',
        });     
    }

    static async createTemplateMessage(data: {
        conversationId:string,
        messageId:string,
        messageFrom:string,
        messageTo:number,
        direction:'incoming' | 'outgoing',
        messageType: 'text'|'template',
        messageContent:string,
        status: 'send'|'delivered' | 'read',
        templateName: string
    }){
        return queryTable(TABLE_NAME, {
            ...data,
            conversationId: data.conversationId,
            status: data.status || 'sent',
        });     
    }

    static async findByConversationId(conversationId:string){
        const result = await selectFromTable(TABLE_NAME, "*", {conversationId});
        return result.length ? result[0] : null;
    }
}


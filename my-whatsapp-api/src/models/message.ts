import { queryTable,selectFromTable } from "../helper/knexConfig";

const TABLE_NAME = 'messages';

export class Messages {
    static async create(data: {
        conversationId:string,
        messageId:string,
        messageFrom:string,
        messageTo:string,
        direction:'incoming' | 'outgoing',
        messageType: 'text'|'image'|'video',
        messageContent:string,
        status: 'send'|'delivered' | 'read'
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



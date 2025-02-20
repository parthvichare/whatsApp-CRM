// import { randomUUID } from 'crypto';
// import { queryTable, selectFromTable } from '../helper/knexConfig'; // Adjust path as needed

// const TABLE_NAME = 'salesAgent';

// export class SalesAgent {
//   static async create(data: { name: string; email: string; password: string; salt: string, role:string }) {
//     return queryTable(TABLE_NAME, data);
//   }


import { queryTable,selectFromTable } from "../helper/knexConfig";
import { Conversations } from "./conversationModel";

const TABLE_NAME = "leads";

export class Leads {
    static async create(data:{name:string,phoneNumber:number,salesAgentId:string,leadStatus:string}){
        return queryTable(TABLE_NAME,data)
    }

        // static async findByConversationId(conversationId:string){
        //     const result = await selectFromTable(TABLE_NAME, "*", {conversationId});
        //     return result.length ? result[0] : null;
        // }
    static async findByPhoneNumber(phoneNumber:number){
        const result = await selectFromTable(TABLE_NAME, "*", {phoneNumber});
        return result
    }
}

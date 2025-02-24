import { queryTable,selectFromTable } from "../helper/knexConfig";

const TABLE_NAME = 'conversations';

interface ConversationSchema{
    leadId:string,
    assignedTo:string
}

export class Conversations {
    static async create(data:{leadId:string, assignedTo:string}) {
        try {
            const [newConversation] = await queryTable(TABLE_NAME,data).returning("*");
            return newConversation;
        } catch (error) {
            console.error("Error creating conversation:", error);
            throw new Error("Failed to create conversation");
        }
    }

    static async findByLeadId(leadId:string){
        console.log("Finding conversation with leadId:", leadId);
        const result = await selectFromTable(TABLE_NAME, "*", { leadId });
        return result.length ? result[0]: null
    }
}

// import { randomUUID } from 'crypto';
// import { queryTable, selectFromTable } from '../helper/knexConfig'; // Adjust path as needed

// const TABLE_NAME = 'salesAgent';

// export class SalesAgent {
//   static async create(data: { name: string; email: string; password: string; salt: string, role:string }) {
//     return queryTable(TABLE_NAME, data);
//   }


import { queryTable,selectFromTable, updateTable } from "../helper/knexConfig";
import { Conversations } from "./conversationModel";

const TABLE_NAME = "leads";

export class Leads {
  static async create(data: {
    name: string;
    phoneNumber: string;
    salesAgentId: string;
    leadStatus: string;
  }) {
    await queryTable(TABLE_NAME, data);
    const result = await selectFromTable(TABLE_NAME, "*", {
      phoneNumber: data.phoneNumber,
    });
    return result.length ? result[0] : null; // Ensure an object is returned
  }

  static async findByPhoneNumber(phoneNumber: string) {
    const result = await selectFromTable(TABLE_NAME, "*", { phoneNumber });
    return result.length ? result[0] : null; // Ensure single object return
  }

  // static async updateMessageStatus(messageId: string, messageStatus: string) {
  //     try {
  //         // Update the message status in the database
  //         const result = await updateTable(TABLE_NAME, { status: messageStatus }, { messageId });

  //         return result > 0; // Returns true if update was successful
  //     } catch (error) {
  //         console.error("❌ Error updating message status:", error);
  //         return false;
  //     }
  // }

  static async updateLeadStatus(id: string, status: string) {
    console.log("Lead Updating", id, status);
    try {
      const result = await updateTable(
        TABLE_NAME,
        { leadStatus: status },
        { id }
      );
      return result > 0;
    } catch (error) {
      console.error("❌ Error updating message status:", error);
      return false;
    }
  }

  static async findLeadBySalesagentId(salesAgentId: string) {
    const result = await selectFromTable(TABLE_NAME, "*", { salesAgentId });
    console.log("Result", result)
    return result;
  }
}

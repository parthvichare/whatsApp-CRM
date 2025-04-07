import { randomUUID } from 'crypto';
import { queryTable, selectFromTable } from '../helper/knexConfig'; // Adjust path as needed

const TABLE_NAME = 'salesAgent';

export class SalesAgent {
  static async create(data: { id:string, firstName: string; branchId:string }) {
    return queryTable(TABLE_NAME, data);
  }

  // static async findByEmail(email: string) {
  //   const result = await selectFromTable(TABLE_NAME, '*', { email });
  //   return result.length ? result[0] : null;
  // }

  static async findById(id: string) {
    const result = await selectFromTable(TABLE_NAME, '*', { id });
    return result.length ? result[0] : null;
  }

  // static async findByNumber()
}




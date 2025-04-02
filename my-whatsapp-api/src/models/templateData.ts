import { randomUUID } from "crypto";
import { queryTable, selectFromTable, updateTable } from "../helper/knexConfig"; // Adjust path as needed

const TABLE_NAME = "templateData";

export class TemplateData {
  static async templateDataCreate(data: {
    templateName: string;
    salesAgentId: string;
    parameterValues: string[];
    templateCategory:string;
    templateBody: string
  }) {
    const formattedData = {
      ...data,
      parameterValues: JSON.stringify(data.parameterValues),
    };
    return queryTable(TABLE_NAME, formattedData);
  }

  static async findTemplateDataById(id:string){
    const result = await selectFromTable(TABLE_NAME,"*",{id});
    return result.length?result[0]:null
  }
      
  static async updateTemplateData(id:string, data:{
    templateName:string,
    salesAgentId:string,
    parameterValues : string[];
    templateCategory:string;
    templateBody: string
  }){
    console.log("Id",id)
    try{
      const templateData = await TemplateData.findTemplateDataById(id)
      const updateTemplateData = {
        ...templateData,
        parameterValues : JSON.stringify(data.parameterValues)
      }
      const result =  await updateTable(TABLE_NAME,updateTemplateData,{id})
      return result > 0
    }catch(error){
      console.error("❌ Error updating message status:", error);
      return false;
    }
  }
}




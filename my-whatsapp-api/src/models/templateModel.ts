import { randomUUID } from 'crypto';
import { queryTable, selectFromTable } from '../helper/knexConfig'; // Adjust path as needed

const TABLE_NAME = "templates"

export class Templates{
    static async create(data: {templateName:string,templateBody:Text, parameterName: string[], templateId:string}){
        const formattedData ={
            ...data,
            parameterName : JSON.stringify(data.parameterName)   //store as JSON
        }
        return queryTable(TABLE_NAME, formattedData)
    }

    static async findOne(templateId:string){
        try{
            const result = await selectFromTable(TABLE_NAME,"*", {templateId});
        
            if(Array.isArray(result) && result.length>0){
                return result[0];
            }
            return null
        }catch(error){
            console.error("Error fetching Template By Id:", error)
            throw error;
        }
    }

    static async findTemplateById(id:string){
        const result = await selectFromTable(TABLE_NAME,"*", {id});
        return result.length? result[0] : null
    }
}
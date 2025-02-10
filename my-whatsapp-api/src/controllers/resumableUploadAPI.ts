import { Request, Response } from "express";
import dotenv from "dotenv";
import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../helper/apiResponse";
import { axiosInstance } from "../helper/utils";
import axios from "axios";

const token = process.env.ACCESS_TOKEN
const headers={
    Authorization: `OAuth ${token}`,
    "Content-Type": 'application/json'
}


// Create Upload Session (MetaData Exchange) [filename,fileType, filelength]
// Upload file data with binary data

export const createUploadSession =  async(req:Request, res:Response)=>{
    const {file_length,file_type, file_name} =  req.body
    const params={
        file_length,
        file_type,
        file_name
    }
    console.log(params)
    try{
        const response = await axiosInstance.post(`/app/uploads/`, params, {headers})
        return successResponseWithData(res,"Upload Session-Id",response.data)
    }catch(error){
        if(axios.isAxiosError(error) && error.response){
            const errorMessage =  error.response.data?.error?.message || "An error occured";
            return errorResponse(res,errorMessage);
        }else{
            return errorResponse(res,(error as Error).message)
        }
    }
}

export const uploadFileData = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Binary Data:", req.file.buffer); 
    res.status(200).json({ message: "File uploaded successfully" });
};



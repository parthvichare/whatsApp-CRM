import {Response} from "express";

interface ResponseData<T = undefined>{
  status: number,
  message:string,
  data?:T
}

export function successResponse(
  res:Response,
  msg:string
): Response<ResponseData>{
  const data : ResponseData ={
    status:1,
    message:msg,
  }
  return res.status(200).json(data)
}

export function successResponseWithData<T>(
  res:Response,
  msg:string,
  data:T
):Response<ResponseData<T>>{
  const resData : ResponseData<T>={
    status:1,
    message:msg,
    data:data
  }
  return res.status(200).json(resData);
}

// Error response
export function errorResponse(
  res:Response,
  msg:string,
): Response<ResponseData>{
  const data: ResponseData={
    status:0,
    message:msg
  }
  return res.status(500).json(data)
}


export function notFoundResponse(
  res:Response,
  msg:string
):Response<ResponseData>{
  const data: ResponseData={
    status:0,
    message:msg
  }
  return res.status(500).json(data);
}


export function validationErrorWithData<T>(
  res:Response,
  msg:string,
  data:T
):Response<ResponseData<T>>{
  const resdata: ResponseData<T>={
    status:0,
    message:msg,
    data:data
  }
  return res.status(400).json(resdata);
}


export function validationError(
  res:Response,
  msg:string
):Response<ResponseData>{
  const data: ResponseData={
    status:0,
    message:msg,
  }
  return res.status(400).json(data)
}



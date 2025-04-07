import { Request, Response } from "express";

import {successResponseWithData,errorResponse,notFoundResponse,validationErrorWithData} from  "../../helper/apiResponse";
import axios from "axios";
import { Templates } from "../../models/templateModel";
import { handleTextMessageFlow,handleTemplateMessageFlow } from "../../helper/utils";
import { extractTemplateDetails,designTemplateBody } from "../../helper/utils";
import { queryTable, selectFromTable,fetchDataById} from '../../helper/knexConfig'; // Adjust path as needed
import db from '../../helper/knexConfig';

// export default class salesAgentService{
//     static async 
// }
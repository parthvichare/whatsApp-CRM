import express from "express";
import whatsappBusinessManagement from "./whatsappBusinessManagement";
import whatsAppRoute from "./whatsApp.route";
import whatsAppService from "../controllers/services/whatsApp.controller";
import salesAgent from "./salesAgent.routes";

const APIRoute = express();

APIRoute.use("/whatsapp-cloud", whatsAppRoute);
APIRoute.use("/sales-agent",salesAgent);


export default APIRoute;
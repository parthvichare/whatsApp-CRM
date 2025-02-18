import express,{Router} from "express";
// import { handleWebhook } from "../controllers/webhookController";
import { createBusinessProfile,editBusinessProfile,getBusinessProfileSection,sendTextMessage } from "../controllers/api/messages/whatsappCloudAPI";
import {createUploadSession,uploadFileData} from "../controllers/testingControllers/resumableUploadAPI";
import multer from "multer";
import {verifyWebhook} from "../helper/utils";
import {handleIncomingMessages} from "../controllers/api/webhookController";
import {sendMessage} from "../controllers/api/socketController"


const router:Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

//webhooks
router.get("/webhook", verifyWebhook);
router.post("/webhook", handleIncomingMessages);

router.post("/messages/send",sendMessage);       //Custom Message
router.post("/messages/template");   //automated messages (reminders, OTPs, confirmations)
router.get("/messages/status");     //webhook message-echoes



























//Update Client Profile Section
router.post("/business-profile",  createBusinessProfile)
router.patch("/busniess-profile", editBusinessProfile)
router.get("/business-profile",   getBusinessProfileSection)

//Upload Profile Photo
router.post("/generate-upload-session", createUploadSession)
router.post("/upload-fileData",upload.single("file"), uploadFileData)

//Connect your Debit/Credit Card for message Payments

// Messaging API Routes
router.post("/sendMessage");
router.post("/sendTemplate");
router.get("/messages");


//Campaign Management Routes
router.post("/campaigns");
router.get("/campaigns/all");
router.get("/campaigns/broadcast")
router.get("/campaigns/:campaignId");
router.get("/campaigns/scheduled")
router.delete("/campaigns/:campaignId");

//Analytics & Reporting Routes
router.get("/reports/message")
router.get("/reports/campaigns")


export default router;
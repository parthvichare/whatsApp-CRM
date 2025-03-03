import express,{Router} from "express";
import { Request, Response } from "express";

// import { handleWebhook } from "../controllers/webhookController";
// import { createBusinessProfile,editBusinessProfile,getBusinessProfileSection,sendTextMessage } from "../services/messages/whatsappCloudAPI";
import {createUploadSession,uploadFileData} from "../controllers/testingControllers/resumableUploadAPI";
import multer from "multer";
import {verifyWebhook} from "../helper/utils";
// import {handleIncomingMessages} from "../controllers/webhookController";
// import {sendMessage} from "../sockets/socketHandler"
import whatsAppService from "../controllers/services/whatsAppService";
import { WebhookController } from "../controllers/webhookController";

const router:Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

//webhooks
router.get("/webhook", verifyWebhook);
router.post("/webhook", WebhookController.handleWebhook);

router.post("/messages/text", async (req, res) => {
    try {
      const { leadPhoneNumber, messageContent,salesAgentId } = req.body;
      const response = await whatsAppService.sendTextMessage(leadPhoneNumber, messageContent,salesAgentId);
      return res.json(response);
    } catch (error) {
      console.error("❌ Error in API Route:", error);
    //   return res.status(500).json({ success: false, error: error.message });
    }
  });
  
router.post("/message/template",whatsAppService.sendTemplateMessage);

router.get("/templates", whatsAppService.getTemplates)

router.get("/messages/status");     //webhook message-echoes



























// //Update Client Profile Section
// router.post("/business-profile",  createBusinessProfile)
// router.patch("/busniess-profile", editBusinessProfile)
// router.get("/business-profile",   getBusinessProfileSection)

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
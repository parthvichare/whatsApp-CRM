import express,{Router} from "express";
import { Request, Response } from "express";
import rateLimit from "express-rate-limit"

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

//Webhook API request
const webhookRateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // Allow only 5 requests per second
  message: "Too many requests, please slow down.",
});

//webhooks
router.get("/webhook", verifyWebhook);
router.post("/webhook",webhookRateLimiter, WebhookController.handleWebhook);

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


router.get("/storedTemplates", whatsAppService.fetchStoredTemplates);

router.get("/templates/:id", whatsAppService.fetchTemplateById);


// Template Data Routes
router.post("/templateData", whatsAppService.storedTemplateData)
router.get("/templateData", whatsAppService.fetchStoredParameterValues)
router.get("/templateData/:id", whatsAppService.fetchParameterValuesById)


router.get("/:salesAgentId/leads",whatsAppService.salesAgentLeads)
router.get("/:salesAgentId/profile",whatsAppService.salesAgentProfile)
router.get("/:conversationId/chats", whatsAppService.salesAgentChats)


router.post("/sales-agent", whatsAppService.createSalesAgent);

router.get("/salesAgent/template", (req, res) => {
  const { status } = req.query; // Extract status from query params

  if (status === "all") {
    return whatsAppService.fetchStoredTemplates(req, res);
  } else if (status === "approved") {
    return whatsAppService.fetchStoredParameterValues(req, res);
  } else {
    return res.status(400).json({ error: "Invalid status value" });
  }
});

// router.get("/salesAgent/template?status=approved", whatsAppService.fetchStoredParameterValues)

router.patch("/templates/:id", whatsAppService.updateTemplateData)
























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
import { Router } from "express";
import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { verifyWebhook } from "../helper/utils";
import whatsAppService from "../controllers/services/whatsApp.controller";
import { WebhookController } from "../controllers/webhookController";

const whatsAppRoute:Router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const webhookRateLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 5, // Allow only 5 requests per second
  message: "Too many requests, please slow down.",
});

whatsAppRoute.get("/webhook", verifyWebhook);
whatsAppRoute.post("/webhook", webhookRateLimiter, WebhookController.handleWebhook);

whatsAppRoute.post("/messages/text", async (req, res) => {
  try {
    const { leadPhoneNumber, messageContent, salesAgentId } = req.body;
    const response = await whatsAppService.sendTextMessage(leadPhoneNumber, messageContent, salesAgentId);
    return res.json(response);
  } catch (error) {
    console.error("❌ Error in API Route:", error);
    return res.status(500).json({ success: false, error: error });
  }
});

whatsAppRoute.post("/message/template", whatsAppService.sendTemplateMessage);

whatsAppRoute.get("/templates", whatsAppService.getTemplates);

export default whatsAppRoute;


















// // //Update Client Profile Section
// // router.post("/business-profile",  createBusinessProfile)
// // router.patch("/busniess-profile", editBusinessProfile)
// // router.get("/business-profile",   getBusinessProfileSection)

// //Upload Profile Photo
// router.post("/generate-upload-session", createUploadSession)
// router.post("/upload-fileData",upload.single("file"), uploadFileData)

// //Connect your Debit/Credit Card for message Payments

// // Messaging API Routes
// router.post("/sendMessage");
// router.post("/sendTemplate");
// router.get("/messages");


// //Campaign Management Routes
// router.post("/campaigns");
// router.get("/campaigns/all");
// router.get("/campaigns/broadcast")
// router.get("/campaigns/:campaignId");
// router.get("/campaigns/scheduled")
// router.delete("/campaigns/:campaignId");

// //Analytics & Reporting Routes
// router.get("/reports/message")
// router.get("/reports/campaigns")


// export default router;
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


export default router;

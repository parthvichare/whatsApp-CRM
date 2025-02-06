import express,{Router} from "express";
import { handleWebhook } from "../controllers/webhookController";

const router:Router = express.Router();


// Messaging API Routes
router.post("/:phoneNumberId/sendMessage");
router.post("/:phoneNumberId/sendTemplate");
router.get("/:phoneNumberId/messages");

//Update Client Profile Section
router.post("/clientBusinessProfile")
router.post("")

//Campaign Management Routes
router.post("/:wabaId/campaigns");
router.get("/:wabaId/campaigns");
router.get("/:wabaId/campaigns/:campaignId");
router.delete("/:wabaId/campaigns/:campaignId");

//Analytics & Reporting Routes
router.get("/:wabaId/reports/message")
router.get("/:wabaId/reports/campaigns")



//webhooks
router.get("/webhooks", handleWebhook);

export default router;
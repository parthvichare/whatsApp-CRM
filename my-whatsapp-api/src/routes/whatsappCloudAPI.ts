import express,{Router} from "express";
import { handleWebhook } from "../controllers/webhookController";

const router:Router = express.Router();


// Messaging API Routes
router.post("/sendMessage");
router.post("/sendTemplate");
router.get("/messages");

//Update Client Profile Section
router.post("/business-profile")
router.patch("/busniess-profile")
router.get("/business-profile")

//Campaign Management Routes
router.post("/campaigns");
router.get("/campaigns");
router.get("/campaigns/:campaignId");
router.delete("/campaigns/:campaignId");

//Analytics & Reporting Routes
router.get("/reports/message")
router.get("/reports/campaigns")

//webhooks
router.get("/webhooks", handleWebhook);

export default router;
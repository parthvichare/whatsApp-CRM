import express,{Router} from "express";

const router:Router = express.Router();

//Client Profile
router.get("/profile")

// Client Contact Management Routes
router.post("/contacts");
router.get("/contacts")
router.get("/contacts/:contactId")
router.delete("/contacts/:contactId")

//Onboarding Message Template to multiple contacts
router.post("/:wabaId/templates/onboard")

// Manage Campaigns
router.get("/campaigns")
router.get("/campaigns/:campaignId")
router.delete("/campaigns/:campaignId")

//Manage Templates
router.get("/templates");
router.post("/templates");
router.get("templates/:templateId");

//View Message Analytics
router.get("/client/analytics");
router.post("/client/phoneNumber");
router.delete("/phoneNumber/:phoneNumberId")

//Update Client business Information
router.get("/webhooks")
router.post("/webhooks")
router.delete("/webhooks/:webhookId")


export default router;
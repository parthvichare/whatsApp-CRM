import express,{Router} from "express";

const router:Router = express.Router();

//Sales Agent Dashboard


//Lead- Management
router.get("/leads/assigned");
router.get("/leads/:leadId");
router.post("/lead/:leadId/status");


// Conversation & Chat History
router.get("/chat");
router.get("/chat/:lead_id");

//Live-Chat
router.get("/live");
router.get("/live/:lead_id");


// Body: { lead_id, message }
router.get("/messages/status");


//Notification Updates
router.get("/notification");
router.post("/notification/mark-read");


//Template Management
router.get("/templates"); 
router.get("/templates/:templateId"); 
router.post("/templates/send");



























//Client Profile
router.get("/profile")
router.patch("/updateProfile")

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
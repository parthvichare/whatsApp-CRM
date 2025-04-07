import express,{Router} from "express";

const router:Router = express.Router();

/** Super Admin Dashboard **/

//Dashboard
router.get("/dashboard/totalLeads")
router.get("/dashboard/activeSalesAgent")
router.get("/dashboard/performance-metrics")

//Live-Chat
router.get("/live")
router.get("/live/:lead_id")

// Conversation & Chat History
router.get("/history")
router.get("/history/:lead_id")

//Lead Management
router.get("/contacts")
router.post("/assignLead")
router.get("/contacts/:contactId")

// Sales Agent Monitoring
router.get("/salesAgents")
router.get("/salesAgents/:agentId")
router.get("/salesAgents/active")


//Message Controlling
router.post("/sendMessage")
router.post("/broadcast")
router.post("/triggerNotification")


/** Manage Section **/

// Adding & Removing sales agents
router.delete("/salesAgents/:id")


//Template Management
router.get("/templates")
router.get("/templates/:templateId")
router.post("/editTemplate/:templateId")


// Analytics and Monitoring
router.get("/reports")
router.get("/messageMetrics")


//Total Billing of conversation & Analytics
router.get("/conversation-billing");
router.get("/conversation-analytics");
















//Manage Clients
router.get("/clients")      //Get All list of clients
router.get("/clients/:clientId")
router.put("/clients/:clientId") //Update client details

//Monitor Campaigns
router.get("/campaigns")     //View All Campaigns
router.get("/campaigns/:campaignId");        // View details of a specific campaign
router.delete("/campaigns/:campaignId");     // Delete a campaign


//Analytics & Reporting
router.get("/reports/campaigns")
router.get("/reports/clients")


router.post("/webhooks")
router.delete("/webhooks/:webhookId")


export default router;


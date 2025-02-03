import express,{Router} from "express";

const router:Router = express.Router();

/** Super Admin Dashboard **/

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


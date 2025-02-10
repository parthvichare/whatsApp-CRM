import express,{Router} from "express";

const router:Router = express.Router();

//Total Billing of conversation & Analytics
router.get("/conversation-billing");
router.get("/conversation-analytics");


//Manage WhatsApp-Business Account Routes
router.get("/:wabaId");
router.get("/:wabaId/phoneNumbers");
router.post("/:wabaId/phoneNumbers/:phoneNumberId/makePrimary");
router.delete("/:wabaId/phoneNumbers/:phoneNumberId");

//Manage Templates Routes
router.post("/:wabaId/templates");   //create New template
router.get("/:wabaId/templates");
router.get("/:wabaId/templates/:templateId");
router.delete("/:wabaId/templates/:templateId");



export default router;
import {Router} from "express";
import salesAgentService from "../controllers/services/salesAgent.controller";

const salesAgent:Router = Router();

salesAgent.get("/storedTemplates", salesAgentService.fetchStoredTemplates);

salesAgent.get("/templates/:id", salesAgentService.fetchTemplateById);


// Template Data Routes
salesAgent.post("/templateData", salesAgentService.storedTemplateData)
salesAgent.get("/templateData", salesAgentService.fetchStoredParameterValues)
salesAgent.get("/templateData/:id", salesAgentService.fetchParameterValuesById)


salesAgent.get("/:salesAgentId/leads",salesAgentService.salesAgentLeads)
salesAgent.get("/:salesAgentId/profile",salesAgentService.salesAgentProfile)
salesAgent.get("/:conversationId/chats", salesAgentService.salesAgentChats)

salesAgent.post("/create", salesAgentService.createSalesAgent);

salesAgent.get("/template", (req, res) => {
  const { status } = req.query; 
  if (status === "all") {
    return salesAgentService.fetchStoredTemplates(req, res);
  } else if (status === "approved") {
    return salesAgentService.fetchStoredParameterValues(req, res);
  } else {
    return res.status(400).json({ error: "Invalid status value" });
  }
});

salesAgent.patch("/templates/:id", salesAgentService.updateTemplateData)

export default salesAgent;
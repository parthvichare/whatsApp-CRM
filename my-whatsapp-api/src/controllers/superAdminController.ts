




// Conversation & Chat History
router.get("/chat")
router.get("/chat/:lead_id")

//Live-Chat
router.get("/live")
router.get("/live/:lead_id")

//Lead Management
router.get("/contacts")
router.post("/assignLead")
router.get("/lead/:leadId")

// Sales Agent Monitoring
router.get("/salesAgents")
router.get("/salesAgents/:agentId")
router.get("/salesAgents/active")


//Message Controlling
router.post("/sendMessage")
router.post("/broadcast")
router.post("/triggerNotification")


//Template Management
router.get("/templates")
router.get("/templates/:templateId")
router.post("/editTemplate/:templateId")


// Analytics and Monitoring
router.get("/reports")
router.get("/messageMetrics")



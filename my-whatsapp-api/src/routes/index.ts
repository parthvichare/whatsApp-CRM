import express from "express";
import embeddedOnboarding from "./embeddedOnboarding";
import whatsappBusinessManagement from "./whatsappBusinessManagement";
import whatsappCloudAPI from "./whatsappCloudAPI"
import superAdmin from "./superAdminRoutes"
import clientRoute from "./salesAgentRoutes"
import salesAgentRoute from "./salesAgentRoutes"

const app = express();

app.use("/admin", superAdmin);
app.use("/agent", salesAgentRoute);


app.use("/onboarding",embeddedOnboarding,whatsappBusinessManagement);
app.use("/whatsapp-business", whatsappBusinessManagement);
app.use("/whatsapp-cloud", whatsappCloudAPI);


export default app
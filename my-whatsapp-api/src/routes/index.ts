import express from "express";
import embeddedOnboarding from "./testingRoutes/embeddedOnboarding";
import whatsappBusinessManagement from "./whatsappBusinessManagement";
import whatsappCloudAPI from "./whatsappCloudAPI";
import superAdmin from "./superAdminRoutes";
import clientRoute from "./salesAgentRoutes";
import salesAgentRoute from "./salesAgentRoutes";
// import DemoSignUp from "../routes/testingRoutes/DemoSignUp";


const app = express();

app.use("/admin", superAdmin);
app.use("/agent", salesAgentRoute);


// app.use("/onboarding",embeddedOnboarding,whatsappBusinessManagement);
app.use("/whatsapp-business", whatsappBusinessManagement);


app.use("/whatsapp-cloud", whatsappCloudAPI);


//Demo
// app.use("/demo",DemoSignUp);


export default app
import express from "express";
import embeddedOnboarding from "./embeddedOnboarding";
import whatsappBusinessManagement from "./whatsappBusinessManagement";
import whatsappCloudAPI from "./whatsappCloudAPI";
import superAdmin from "./superAdmin";
import clientRoute from "./clientRoutes";

const app = express();

app.use("/onboarding", embeddedOnboarding);
app.use("/whatsapp-business", whatsappBusinessManagement);
app.use("/whatsapp-cloud", whatsappCloudAPI);
app.use("/admin", superAdmin);
app.use("/client", clientRoute);

export default app
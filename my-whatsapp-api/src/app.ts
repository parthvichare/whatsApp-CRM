import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import 'dotenv/config';
import Routes from "./routes/index";
import { notFoundResponse } from "./helper/apiResponse";

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/api", Routes);

// app.all("*", (req: Request, res: Response) => {
//     return notFoundResponse(res, "Page Not found");
// });

export default app;
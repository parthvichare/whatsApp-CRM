import axios from "axios";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export const axiosInstance = axios.create({
    baseURL: `https://graph.facebook.com/${process.env.API_VERSION}/`, // Corrected property name
    timeout: 10000,
});
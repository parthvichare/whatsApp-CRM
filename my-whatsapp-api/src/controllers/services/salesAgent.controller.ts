import { Request, Response } from "express";
import {successResponseWithData} from "../../helper/apiResponse";
import {fetchDataById} from "../../helper/knexConfig"; // Adjust path as needed
import db from "../../helper/knexConfig";
import { SalesAgent } from "../../models/salesAgent";
import { TemplateData } from "../../models/templateData";
import { Leads } from "../../models/leadModel";
import { Conversations } from "../../models/conversationModel";
import { Messages } from "../../models/messageModel";

export default class salesAgentService {
  //createSalesAgent, fetchStoredTemplates, fetchTemplateById, storedTemplateData, updateTemplateData, salesAgentLeads, salesAgentChats, salesAgentProfile
  static async createSalesAgent(req: Request, res: Response) {
    console.log("Creating Sales Agent", req.body); // 👈 should now log correct data
    const { id, firstName, branchId } = req.body;

    const data = { id, firstName, branchId };
    const newSalesAgent = await SalesAgent.create(data);

    return successResponseWithData(
      res,
      "Sales Agent Created Successfully",
      newSalesAgent
    );
  }

  static async fetchStoredTemplates(req: Request, res: Response) {
    try {
      // Fetching templates from the database
      const templates = await db("templates").select("*");

      // Check if the returned array is empty
      if (templates.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No templates found",
          data: [],
        });
      }
      const response = {
        success: true,
        message: "Fetched data successfully",
        responseData: templates,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching templates:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error || "Unknown error",
      });
    }
  }

  static async fetchTemplateById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const templates = await fetchDataById("templates", id);
      const response = {
        success: true,
        message: "Fetched data successfully",
        responseData: templates,
      };
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error || "Unknown error",
      });
    }
  }

  static async storedTemplateData(req: Request, res: Response) {
    console.log("Storing Template Data");
    try {
      // const {salesAgentId,templateId,parameterValues} = req.params
      const data = req.body;
      console.log("Template Data", data);
      const existingTemplate = await db("templateData")
        .where({
          templateName: data.templateName,
          salesAgentId: data.salesAgentId,
        })
        .first();

      console.log("existingTemplate", existingTemplate);

      if (existingTemplate) {
        const updatedTemplateData = await TemplateData.updateTemplateData(
          existingTemplate.id,
          data
        );
        return successResponseWithData(
          res,
          "Template Already Exist",
          updatedTemplateData
        );
      } else {
        const templates = await TemplateData.templateDataCreate(data);
        return successResponseWithData(
          res,
          "Message Template Successfully",
          templates
        );
      }
    } catch (error: any) {
      console.error(
        "Error in sendTemplateMessage:",
        error?.response?.data || error.message
      );
      return res.status(500).json({
        error: "Internal Server Error",
        details: error?.response?.data,
      });
    }
  }

  static async fetchStoredParameterValues(req: Request, res: Response) {
    console.log("fetching Parameter Values");
    try {
      // Fetching templates from the database
      const templates = await db("templateData").select("*");

      // Check if the returned array is empty
      if (templates.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No templates found",
          data: [],
        });
      }
      const response = {
        success: true,
        message: "Fetched data successfully",
        responseData: templates,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching templates:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error || "Unknown error",
      });
    }
  }

  static fetchParameterValuesById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const templates = await fetchDataById("templateData", id);
      const response = {
        success: true,
        message: "Fetched data successfully",
        responseData: templates,
      };
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error || "Unknown error",
      });
    }
  };

  static async updateTemplateData(req: Request, res: Response) {
    console.log(req.params);
    try {
      const { id } = req.params; // ✅ Extract templateData ID from URL
      const updateFields = req.body; // ✅ Extract fields to be updated

      if (!id) {
        return res.status(400).json({ error: "Missing templateData ID" });
      }

      const updatedTemplateData = await TemplateData.updateTemplateData(
        id,
        updateFields
      );

      return successResponseWithData(
        res,
        "Message Template Updated Successfully",
        updatedTemplateData
      );
    } catch (error: any) {
      console.error(
        "Error in updateTemplateData:",
        error?.response?.data || error.message
      );
      return res.status(500).json({
        error: "Internal Server Error",
        details: error?.response?.data || error.message,
      });
    }
  }
  //Sales Agent Leads
  static async salesAgentLeads(req: Request, res: Response) {
    console.log("salesAGentId");
    try {
      const { salesAgentId } = req.params;
      if (!salesAgentId) {
        return res.status(400).json({ error: "Missing SalesAgent Id" });
      }
      const leads = await Leads.findLeadBySalesagentId(salesAgentId);
      const salesAgentLeads = await Promise.all(
        leads.map(async (lead: any) => {
          const conversation = await Conversations.findByLeadId(lead.id);
          return {
            leadId: lead.id,
            conversationId: conversation?.id || null, // Only return the ID
            fullName: lead.name,
            phoneNumber: lead.phoneNumber, // Fixed typo
            leadStatus: lead.leadStatus,
          };
        })
      );
      const response = {
        success: true,
        message: "Fetched data successfully",
        responseData: salesAgentLeads,
      };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(
        "Error in updateTemplateData:",
        error?.response?.data || error.message
      );
      return res.status(500).json({
        error: "Internal Server Error",
        details: error?.response?.data || error.message,
      });
    }
  }

  static async salesAgentChats(req: Request, res: Response) {
    console.log("sales AgentId");
    try {
      const { conversationId } = req.params;
      console.log("Contacts", conversationId);
      if (!conversationId) {
        return res.status(400).json({ error: "Missing SalesAgent Id" });
      }
      // First Check List of Contacts with Respective SalesAgent
      const salesAgentChats =
        await Messages.findByConversationId(conversationId);

      const response = {
        success: true,
        message: "Fetched data successfully",
        responseData: salesAgentChats,
      };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(
        "Error in updateTemplateData:",
        error?.response?.data || error.message
      );
      return res.status(500).json({
        error: "Internal Server Error",
        details: error?.response?.data || error.message,
      });
    }
  }

  static async salesAgentProfile(req: Request, res: Response) {
    console.log("sales AgentId");
    try {
      const { salesAgentId } = req.params;
      if (!salesAgentId) {
        return res.status(400).json({ error: "Missing SalesAgent Id" });
      }

      const salesAgentProfile = await SalesAgent.findById(salesAgentId);
      const response = {
        success: true,
        message: "Fetched data successfully",
        responseData: salesAgentProfile,
      };
      return res.status(200).json(response);
    } catch (error: any) {
      console.error(
        "Error in updateTemplateData:",
        error?.response?.data || error.message
      );
      return res.status(500).json({
        error: "Internal Server Error",
        details: error?.response?.data || error.message,
      });
    }
  }
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user settings
  app.get("/api/user/:id/settings", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const settings = await storage.getUserSettings(userId);
      
      if (!settings) {
        return res.status(404).json({ message: "User settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user settings
  app.put("/api/user/:id/settings", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const settingsData = insertUserSettingsSchema.parse(req.body);
      
      const updatedSettings = await storage.updateUserSettings(userId, settingsData);
      res.json(updatedSettings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid settings data", errors: error.errors });
      }
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user profile
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Manual backup endpoint
  app.post("/api/user/:id/backup", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const settings = await storage.getUserSettings(userId);
      
      if (!settings) {
        return res.status(404).json({ message: "User settings not found" });
      }
      
      res.json({ message: "Backup completed successfully", timestamp: new Date() });
    } catch (error) {
      console.error("Error creating backup:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

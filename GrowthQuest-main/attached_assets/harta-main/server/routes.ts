import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProgressSchema, insertUserCardSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user profile with progress
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUserWithProgress(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user", error: error.message });
    }
  });

  // Get all regions with user progress
  app.get("/api/regions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const regions = await storage.getRegionsWithProgress(userId);
      res.json(regions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get regions", error: error.message });
    }
  });

  // Complete a level
  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.completeLevel(progressData.userId, progressData.levelNumber);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to complete level", error: error.message });
    }
  });

  // Get user's available card rewards
  app.get("/api/rewards/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const rewards = await storage.getAvailableRewards(userId);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get rewards", error: error.message });
    }
  });

  // Collect a card reward
  app.post("/api/cards/collect", async (req, res) => {
    try {
      const cardData = insertUserCardSchema.parse(req.body);
      const userCard = await storage.collectCard(cardData.userId, cardData.cardId);
      res.json(userCard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to collect card", error: error.message });
    }
  });

  // Get user's collected cards
  app.get("/api/cards/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userCards = await storage.getUserCards(userId);
      const allCards = await storage.getAllCards();
      
      const collectedCards = userCards.map(uc => {
        const card = allCards.find(c => c.id === uc.cardId);
        return {
          ...uc,
          card
        };
      });
      
      res.json(collectedCards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user cards", error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

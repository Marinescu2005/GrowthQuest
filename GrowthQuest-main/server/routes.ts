import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupMockAuth, mockIsAuthenticated } from "./mockAuth";
import { 
  insertGoalSchema, 
  insertProgressEntrySchema,
  insertCommunityPostSchema,
  insertPostReplySchema,
  insertJournalEntrySchema,
  insertUserSettingsSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock Auth middleware for testing
  await setupMockAuth(app);

  // Goals routes
  app.get('/api/goals', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goals = await storage.getUserGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post('/api/goals', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertGoalSchema.parse({
        ...req.body,
        userId
      });
      const goal = await storage.createGoal(validatedData);
      res.json(goal);
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  app.patch('/api/goals/:id', mockIsAuthenticated, async (req: any, res) => {
    try {
      const goalId = parseInt(req.params.id);
      const updates = req.body;
      const goal = await storage.updateGoal(goalId, updates);
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
      res.json(goal);
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  app.delete('/api/goals/:id', mockIsAuthenticated, async (req: any, res) => {
    try {
      const goalId = parseInt(req.params.id);
      await storage.deleteGoal(goalId);
      res.json({ message: "Goal deleted successfully" });
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Progress routes
  app.get('/api/progress', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const goalId = req.query.goalId ? parseInt(req.query.goalId as string) : undefined;
      const entries = await storage.getProgressEntries(userId, goalId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/progress', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProgressEntrySchema.parse({
        ...req.body,
        userId
      });
      const entry = await storage.createProgressEntry(validatedData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating progress entry:", error);
      res.status(500).json({ message: "Failed to create progress entry" });
    }
  });

  app.get('/api/progress/daily-xp', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const days = parseInt(req.query.days as string) || 7;
      const dailyXP = await storage.getUserDailyXP(userId, days);
      res.json(dailyXP);
    } catch (error) {
      console.error("Error fetching daily XP:", error);
      res.status(500).json({ message: "Failed to fetch daily XP" });
    }
  });

  // Achievements routes
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/achievements/user', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userAchievements = await storage.getUserAchievements(userId);
      res.json(userAchievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  app.post('/api/achievements/check', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const newAchievements = await storage.checkAndAwardAchievements(userId);
      res.json(newAchievements);
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  // Community routes
  app.get('/api/community/posts', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const posts = await storage.getCommunityPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.post('/api/community/posts', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertCommunityPostSchema.parse({
        ...req.body,
        userId
      });
      const post = await storage.createCommunityPost(validatedData);
      res.json(post);
    } catch (error) {
      console.error("Error creating community post:", error);
      res.status(500).json({ message: "Failed to create community post" });
    }
  });

  app.post('/api/community/posts/:id/like', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      await storage.likePost(userId, postId);
      res.json({ message: "Post liked successfully" });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.delete('/api/community/posts/:id/like', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      await storage.unlikePost(userId, postId);
      res.json({ message: "Post unliked successfully" });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  app.get('/api/community/posts/:id/replies', async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const replies = await storage.getPostReplies(postId);
      res.json(replies);
    } catch (error) {
      console.error("Error fetching replies:", error);
      res.status(500).json({ message: "Failed to fetch replies" });
    }
  });

  app.post('/api/community/posts/:id/replies', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postId = parseInt(req.params.id);
      const validatedData = insertPostReplySchema.parse({
        ...req.body,
        userId,
        postId
      });
      const reply = await storage.createPostReply(validatedData);
      res.json(reply);
    } catch (error) {
      console.error("Error creating reply:", error);
      res.status(500).json({ message: "Failed to create reply" });
    }
  });

  // Leaderboard routes
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Journal routes
  app.get('/api/journal', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching journal entries:", error);
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.post('/api/journal', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertJournalEntrySchema.parse({
        ...req.body,
        userId
      });
      const entry = await storage.createJournalEntry(validatedData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating journal entry:", error);
      res.status(500).json({ message: "Failed to create journal entry" });
    }
  });

  app.get('/api/journal/stats', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getJournalStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching journal stats:", error);
      res.status(500).json({ message: "Failed to fetch journal stats" });
    }
  });

  // Settings routes
  app.get('/api/settings', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = await storage.getUserSettings(userId);
      res.json(settings || {});
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post('/api/settings', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.updateUserSettings(userId, validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Daily Quests routes
  app.get('/api/daily-quests', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userQuests = await storage.getUserDailyQuests(userId);
      res.json(userQuests);
    } catch (error) {
      console.error("Error fetching daily quests:", error);
      res.status(500).json({ message: "Failed to fetch daily quests" });
    }
  });

  app.post('/api/daily-quests/assign', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const assignedQuests = await storage.assignDailyQuests(userId);
      res.json(assignedQuests);
    } catch (error) {
      console.error("Error assigning daily quests:", error);
      res.status(500).json({ message: "Failed to assign daily quests" });
    }
  });

  app.post('/api/daily-quests/:id/complete', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const questId = parseInt(req.params.id);
      const completedQuest = await storage.completeQuest(userId, questId);
      res.json(completedQuest);
    } catch (error) {
      console.error("Error completing quest:", error);
      res.status(500).json({ message: "Failed to complete quest" });
    }
  });

  // Badges routes
  app.get('/api/badges', async (req, res) => {
    try {
      const badges = await storage.getAllBadges();
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ message: "Failed to fetch badges" });
    }
  });

  app.get('/api/badges/user', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userBadges = await storage.getUserBadges(userId);
      res.json(userBadges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
      res.status(500).json({ message: "Failed to fetch user badges" });
    }
  });

  // Titles routes
  app.get('/api/titles', async (req, res) => {
    try {
      const titles = await storage.getAllTitles();
      res.json(titles);
    } catch (error) {
      console.error("Error fetching titles:", error);
      res.status(500).json({ message: "Failed to fetch titles" });
    }
  });

  app.get('/api/titles/user', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userTitles = await storage.getUserTitles(userId);
      res.json(userTitles);
    } catch (error) {
      console.error("Error fetching user titles:", error);
      res.status(500).json({ message: "Failed to fetch user titles" });
    }
  });

  app.post('/api/titles/:id/activate', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const titleId = parseInt(req.params.id);
      await storage.setActiveTitle(userId, titleId);
      res.json({ message: "Title activated successfully" });
    } catch (error) {
      console.error("Error activating title:", error);
      res.status(500).json({ message: "Failed to activate title" });
    }
  });

  // XP routes
  app.post('/api/xp/award', mockIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount, source } = req.body;
      const updatedUser = await storage.awardXP(userId, amount, source);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error awarding XP:", error);
      res.status(500).json({ message: "Failed to award XP" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
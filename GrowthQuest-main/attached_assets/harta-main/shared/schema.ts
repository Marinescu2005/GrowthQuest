import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  totalXP: integer("total_xp").notNull().default(0),
  currentLevel: integer("current_level").notNull().default(1),
  totalCards: integer("total_cards").notNull().default(0),
});

export const regions = pgTable("regions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  emoji: text("emoji").notNull(),
  startLevel: integer("start_level").notNull(),
  endLevel: integer("end_level").notNull(),
  theme: text("theme").notNull(), // gradient classes
  unlockRequirement: integer("unlock_requirement").notNull().default(0),
});

export const levels = pgTable("levels", {
  id: serial("id").primaryKey(),
  levelNumber: integer("level_number").notNull().unique(),
  regionId: integer("region_id").notNull(),
  name: text("name").notNull(),
  objective: text("objective").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  timeframe: text("timeframe").notNull(),
  isRewardLevel: boolean("is_reward_level").notNull().default(false),
  isBossLevel: boolean("is_boss_level").notNull().default(false),
  xpReward: integer("xp_reward").notNull().default(10),
});

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  rarity: text("rarity").notNull(), // common, uncommon, rare, legendary
  type: text("type").notNull(), // motivational, achievement, boss
  unlockLevel: integer("unlock_level").notNull(),
  isUnique: boolean("is_unique").notNull().default(false),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  levelNumber: integer("level_number").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

export const userCards = pgTable("user_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardId: integer("card_id").notNull(),
  collectedAt: timestamp("collected_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  totalXP: true,
  currentLevel: true,
  totalCards: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
});

export const insertUserCardSchema = createInsertSchema(userCards).omit({
  id: true,
  collectedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Region = typeof regions.$inferSelect;
export type Level = typeof levels.$inferSelect;
export type Card = typeof cards.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserCard = typeof userCards.$inferSelect;
export type InsertUserCard = z.infer<typeof insertUserCardSchema>;

// Extended types for API responses
export type UserWithProgress = User & {
  completedLevels: number;
  nextRewardLevel: number;
  progressPercentage: number;
};

export type RegionWithProgress = Region & {
  completedLevels: number;
  totalLevels: number;
  isUnlocked: boolean;
  levels: (Level & { completed: boolean; isAvailable: boolean })[];
};

export type CardReward = {
  card: Card;
  earnedAt: number; // level number
};

import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  decimal,
  serial,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // fitness, learning, reading, mindfulness, etc.
  targetValue: decimal("target_value"),
  currentValue: decimal("current_value").default("0"),
  unit: varchar("unit"), // books, minutes, sessions, etc.
  frequency: varchar("frequency").notNull(), // daily, weekly, monthly
  isCompleted: boolean("is_completed").default(false),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const progressEntries = pgTable("progress_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  goalId: integer("goal_id").references(() => goals.id),
  value: decimal("value").notNull(),
  xpEarned: integer("xp_earned").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  icon: varchar("icon").notNull(),
  category: varchar("category").notNull(),
  requirement: jsonb("requirement").notNull(), // {type: "streak", value: 7} or {type: "xp", value: 1000}
  xpReward: integer("xp_reward").default(0),
  rarity: varchar("rarity", { length: 50 }).default("common"), // common, rare, epic, legendary
  isHidden: boolean("is_hidden").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const titles = pgTable("titles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  requiredLevel: integer("required_level").default(1),
  requiredAchievements: integer("required_achievements").array(),
  color: varchar("color", { length: 50 }).default("#6C5CE7"),
  rarity: varchar("rarity", { length: 50 }).default("common"),
  isUnlockable: boolean("is_unlockable").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userTitles = pgTable("user_titles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  titleId: integer("title_id").notNull().references(() => titles.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  isActive: boolean("is_active").default(false),
});

export const dailyQuests = pgTable("daily_quests", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(), // complete_goal, login, journal_entry, social_interaction
  xpReward: integer("xp_reward").default(50),
  requirement: integer("requirement").default(1),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userDailyQuests = pgTable("user_daily_quests", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  questId: integer("quest_id").notNull().references(() => dailyQuests.id),
  progress: integer("progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  assignedAt: timestamp("assigned_at").defaultNow(),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(), // xp, loot_box, title, badge
  value: integer("value").default(0),
  rarity: varchar("rarity", { length: 50 }).default("common"),
  iconUrl: varchar("icon_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon").notNull(),
  category: varchar("category").notNull(),
  rarity: varchar("rarity", { length: 50 }).default("common"),
  color: varchar("color", { length: 50 }).default("#6C5CE7"),
  requirement: jsonb("requirement").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeId: integer("badge_id").notNull().references(() => badges.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  replies: integer("replies").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const postLikes = pgTable("post_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postReplies = pgTable("post_replies", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Loot box and items system
export const lootBoxes = pgTable("loot_boxes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // "level" or "objective"
  isOpened: boolean("is_opened").default(false),
  earnedAt: timestamp("earned_at").defaultNow(),
  openedAt: timestamp("opened_at"),
});

export const lootItems = pgTable("loot_items", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  rarity: varchar("rarity").notNull(), // "common", "rare", "epic", "legendary"
  type: varchar("type").notNull(), // "xp_boost", "achievement_badge", "title", "theme"
  value: integer("value").default(0),
  description: text("description"),
  icon: varchar("icon").default("gift"),
  probability: integer("probability").default(100), // Weight for random selection
  isActive: boolean("is_active").default(true),
});

export const userLootItems = pgTable("user_loot_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  lootItemId: integer("loot_item_id").notNull().references(() => lootItems.id),
  lootBoxId: integer("loot_box_id").references(() => lootBoxes.id),
  receivedAt: timestamp("received_at").defaultNow(),
  isUsed: boolean("is_used").default(false),
});

// Journal entries system
export const journalEntries = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  content: text("content"),
  mood: varchar("mood"),
  tags: text("tags").array(),
  wordCount: integer("word_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User settings and preferences
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  displayName: varchar("display_name"),
  bio: text("bio"),
  theme: varchar("theme").default("system"), // "light", "dark", "system"
  language: varchar("language").default("ro"), // "ro", "en"
  notifications: jsonb("notifications").default({
    email: true,
    push: true,
    achievements: true,
    community: true,
  }),
  privacy: jsonb("privacy").default({
    showProfile: true,
    showProgress: true,
    showAchievements: true,
  }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  unique().on(table.userId),
]);

// World admission system
export const worldAdmissions = pgTable("world_admissions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  statement: text("statement").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  isApproved: boolean("is_approved").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  unique().on(table.userId),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  goals: many(goals),
  progressEntries: many(progressEntries),
  userAchievements: many(userAchievements),
  communityPosts: many(communityPosts),
  postLikes: many(postLikes),
  postReplies: many(postReplies),
}));

export const goalsRelations = relations(goals, ({ one, many }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
  progressEntries: many(progressEntries),
}));

export const progressEntriesRelations = relations(progressEntries, ({ one }) => ({
  user: one(users, {
    fields: [progressEntries.userId],
    references: [users.id],
  }),
  goal: one(goals, {
    fields: [progressEntries.goalId],
    references: [goals.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
  userAchievements: many(userAchievements),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [communityPosts.userId],
    references: [users.id],
  }),
  postLikes: many(postLikes),
  postReplies: many(postReplies),
}));

export const postLikesRelations = relations(postLikes, ({ one }) => ({
  user: one(users, {
    fields: [postLikes.userId],
    references: [users.id],
  }),
  post: one(communityPosts, {
    fields: [postLikes.postId],
    references: [communityPosts.id],
  }),
}));

export const postRepliesRelations = relations(postReplies, ({ one }) => ({
  user: one(users, {
    fields: [postReplies.userId],
    references: [users.id],
  }),
  post: one(communityPosts, {
    fields: [postReplies.postId],
    references: [communityPosts.id],
  }),
}));

export const titlesRelations = relations(titles, ({ many }) => ({
  userTitles: many(userTitles),
}));

export const userTitlesRelations = relations(userTitles, ({ one }) => ({
  user: one(users, {
    fields: [userTitles.userId],
    references: [users.id],
  }),
  title: one(titles, {
    fields: [userTitles.titleId],
    references: [titles.id],
  }),
}));

export const dailyQuestsRelations = relations(dailyQuests, ({ many }) => ({
  userDailyQuests: many(userDailyQuests),
}));

export const userDailyQuestsRelations = relations(userDailyQuests, ({ one }) => ({
  user: one(users, {
    fields: [userDailyQuests.userId],
    references: [users.id],
  }),
  quest: one(dailyQuests, {
    fields: [userDailyQuests.questId],
    references: [dailyQuests.id],
  }),
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id],
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id],
  }),
}));

// Insert schemas
export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProgressEntrySchema = createInsertSchema(progressEntries).omit({
  id: true,
  createdAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
  replies: true,
});

export const insertPostReplySchema = createInsertSchema(postReplies).omit({
  id: true,
  createdAt: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
export type InsertProgressEntry = z.infer<typeof insertProgressEntrySchema>;
export type ProgressEntry = typeof progressEntries.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertPostReply = z.infer<typeof insertPostReplySchema>;
export type PostReply = typeof postReplies.$inferSelect;
export type LootBox = typeof lootBoxes.$inferSelect;
export type LootItem = typeof lootItems.$inferSelect;
export type UserLootItem = typeof userLootItems.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

// New gamification types
export type Title = typeof titles.$inferSelect;
export type UserTitle = typeof userTitles.$inferSelect;
export type DailyQuest = typeof dailyQuests.$inferSelect;
export type UserDailyQuest = typeof userDailyQuests.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;

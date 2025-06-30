import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  language: text("language").default("ro"),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  dailyReminders: boolean("daily_reminders").default(true),
  reminderTime: text("reminder_time").default("19:00"),
  theme: text("theme").default("light"),
  soundEnabled: boolean("sound_enabled").default(true),
  soundVolume: integer("sound_volume").default(70),
  privacyMode: boolean("privacy_mode").default(false),
  autoSave: boolean("auto_save").default(true),
  weekStartsOn: text("week_starts_on").default("monday"),
  timeFormat: text("time_format").default("24h"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

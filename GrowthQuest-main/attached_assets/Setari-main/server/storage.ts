import { users, userSettings, type User, type InsertUser, type UserSettings, type InsertUserSettings } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(userId: number, settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userSettings: Map<number, UserSettings>;
  currentId: number;
  currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.userSettings = new Map();
    this.currentId = 1;
    this.currentSettingsId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      email: insertUser.email || null,
      level: 1,
      xp: 37,
      createdAt: new Date()
    };
    this.users.set(id, user);
    
    // Create default settings for new user
    await this.createUserSettings(id, {});
    
    return user;
  }

  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      (settings) => settings.userId === userId,
    );
  }

  async createUserSettings(userId: number, settings: InsertUserSettings): Promise<UserSettings> {
    const id = this.currentSettingsId++;
    const userSettings: UserSettings = {
      id,
      userId,
      language: settings.language || "ro",
      notificationsEnabled: settings.notificationsEnabled ?? true,
      dailyReminders: settings.dailyReminders ?? true,
      reminderTime: settings.reminderTime || "19:00",
      theme: settings.theme || "light",
      soundEnabled: settings.soundEnabled ?? true,
      soundVolume: settings.soundVolume ?? 70,
      privacyMode: settings.privacyMode ?? false,
      autoSave: settings.autoSave ?? true,
      weekStartsOn: settings.weekStartsOn || "monday",
      timeFormat: settings.timeFormat || "24h",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.userSettings.set(id, userSettings);
    return userSettings;
  }

  async updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existingSettings = await this.getUserSettings(userId);
    if (!existingSettings) {
      throw new Error("User settings not found");
    }

    const updatedSettings: UserSettings = {
      ...existingSettings,
      ...settings,
      updatedAt: new Date(),
    };

    this.userSettings.set(existingSettings.id, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();

// Create a demo user with settings
(async () => {
  const demoUser = await storage.createUser({
    username: "demo",
    password: "demo123",
    email: "demo@transcendup.ro"
  });
})();

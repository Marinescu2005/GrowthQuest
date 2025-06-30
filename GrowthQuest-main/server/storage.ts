import {
  users,
  goals,
  progressEntries,
  achievements,
  userAchievements,
  communityPosts,
  postLikes,
  postReplies,
  journalEntries,
  userSettings,
  lootBoxes,
  lootItems,
  userLootItems,
  titles,
  userTitles,
  dailyQuests,
  userDailyQuests,
  badges,
  userBadges,
  rewards,
  type User,
  type UpsertUser,
  type Goal,
  type InsertGoal,
  type ProgressEntry,
  type InsertProgressEntry,
  type Achievement,
  type UserAchievement,
  type CommunityPost,
  type InsertCommunityPost,
  type PostReply,
  type InsertPostReply,
  type JournalEntry,
  type InsertJournalEntry,
  type UserSettings,
  type InsertUserSettings,
  type LootBox,
  type LootItem,
  type UserLootItem,
  type Title,
  type UserTitle,
  type DailyQuest,
  type UserDailyQuest,
  type Badge,
  type UserBadge,
  type Reward,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Goal operations
  getUserGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined>;
  deleteGoal(id: number): Promise<void>;
  
  // Progress operations
  getProgressEntries(userId: string, goalId?: number): Promise<ProgressEntry[]>;
  createProgressEntry(entry: InsertProgressEntry): Promise<ProgressEntry>;
  getUserDailyXP(userId: string, days: number): Promise<{ date: string; xp: number }[]>;
  
  // Achievement operations
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]>;
  checkAndAwardAchievements(userId: string): Promise<UserAchievement[]>;
  
  // Community operations
  getCommunityPosts(limit: number): Promise<(CommunityPost & { user: User; isLiked?: boolean })[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  likePost(userId: string, postId: number): Promise<void>;
  unlikePost(userId: string, postId: number): Promise<void>;
  getPostReplies(postId: number): Promise<(PostReply & { user: User })[]>;
  createPostReply(reply: InsertPostReply): Promise<PostReply>;
  
  // Leaderboard operations
  getLeaderboard(limit: number): Promise<User[]>;
  
  // Level operations
  updateUserXP(userId: string, xpToAdd: number): Promise<User>;

  // Journal operations
  getJournalEntries(userId: string): Promise<JournalEntry[]>;
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalStats(userId: string): Promise<{
    totalEntries: number;
    currentStreak: number;
    totalWords: number;
    averageWordsPerEntry: number;
    recentMoods: string[];
  }>;

  // Settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;

  // Loot box operations
  getUserLootBoxes(userId: string): Promise<LootBox[]>;
  openLootBox(userId: string, lootBoxId: number): Promise<LootItem[]>;

  // Title operations
  getAllTitles(): Promise<Title[]>;
  getUserTitles(userId: string): Promise<(UserTitle & { title: Title })[]>;
  unlockTitle(userId: string, titleId: number): Promise<UserTitle>;
  setActiveTitle(userId: string, titleId: number): Promise<void>;

  // Daily quest operations
  getDailyQuests(): Promise<DailyQuest[]>;
  getUserDailyQuests(userId: string): Promise<(UserDailyQuest & { quest: DailyQuest })[]>;
  assignDailyQuests(userId: string): Promise<UserDailyQuest[]>;
  updateQuestProgress(userId: string, questId: number, progress: number): Promise<UserDailyQuest>;
  completeQuest(userId: string, questId: number): Promise<UserDailyQuest>;

  // Badge operations
  getAllBadges(): Promise<Badge[]>;
  getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]>;
  awardBadge(userId: string, badgeId: number): Promise<UserBadge>;

  // XP and level management
  calculateLevel(xp: number): number;
  getXPForNextLevel(currentLevel: number): number;
  awardXP(userId: string, amount: number, source: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserGoals(userId: string): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(desc(goals.createdAt));
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const [newGoal] = await db.insert(goals).values(goal).returning();
    return newGoal;
  }

  async updateGoal(id: number, updates: Partial<Goal>): Promise<Goal | undefined> {
    const [updatedGoal] = await db
      .update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();
    return updatedGoal;
  }

  async deleteGoal(id: number): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  async getProgressEntries(userId: string, goalId?: number): Promise<ProgressEntry[]> {
    const conditions = [eq(progressEntries.userId, userId)];
    if (goalId) {
      conditions.push(eq(progressEntries.goalId, goalId));
    }
    
    return await db
      .select()
      .from(progressEntries)
      .where(and(...conditions))
      .orderBy(desc(progressEntries.createdAt));
  }

  async createProgressEntry(entry: InsertProgressEntry): Promise<ProgressEntry> {
    const [newEntry] = await db.insert(progressEntries).values(entry).returning();
    
    // Update user XP
    if (entry.xpEarned && entry.xpEarned > 0) {
      await this.updateUserXP(entry.userId, entry.xpEarned);
    }
    
    return newEntry;
  }

  async getUserDailyXP(userId: string, days: number): Promise<{ date: string; xp: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const result = await db
      .select({
        date: sql<string>`DATE(${progressEntries.createdAt})`,
        xp: sql<number>`COALESCE(SUM(${progressEntries.xpEarned}), 0)`,
      })
      .from(progressEntries)
      .where(
        and(
          eq(progressEntries.userId, userId),
          gte(progressEntries.createdAt, startDate)
        )
      )
      .groupBy(sql`DATE(${progressEntries.createdAt})`)
      .orderBy(sql`DATE(${progressEntries.createdAt})`);
    
    return result;
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<(UserAchievement & { achievement: Achievement })[]> {
    const result = await db
      .select({
        userAchievement: userAchievements,
        achievement: achievements
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.earnedAt));
    
    return result.map(row => ({
      ...row.userAchievement,
      achievement: row.achievement
    }));
  }

  async checkAndAwardAchievements(userId: string): Promise<UserAchievement[]> {
    // This would implement achievement checking logic
    // For now, return empty array - would need to implement based on achievement requirements
    return [];
  }

  async getCommunityPosts(limit: number): Promise<(CommunityPost & { user: User; isLiked?: boolean })[]> {
    const result = await db
      .select({
        post: communityPosts,
        user: users
      })
      .from(communityPosts)
      .innerJoin(users, eq(communityPosts.userId, users.id))
      .orderBy(desc(communityPosts.createdAt))
      .limit(limit);
    
    return result.map(row => ({
      ...row.post,
      user: row.user,
      isLiked: false // would need to implement user-specific like checking
    }));
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const [newPost] = await db.insert(communityPosts).values(post).returning();
    return newPost;
  }

  async likePost(userId: string, postId: number): Promise<void> {
    await db.insert(postLikes).values({ userId, postId });
    await db
      .update(communityPosts)
      .set({ likes: sql`${communityPosts.likes} + 1` })
      .where(eq(communityPosts.id, postId));
  }

  async unlikePost(userId: string, postId: number): Promise<void> {
    await db.delete(postLikes).where(
      and(eq(postLikes.userId, userId), eq(postLikes.postId, postId))
    );
    await db
      .update(communityPosts)
      .set({ likes: sql`${communityPosts.likes} - 1` })
      .where(eq(communityPosts.id, postId));
  }

  async getPostReplies(postId: number): Promise<(PostReply & { user: User })[]> {
    const result = await db
      .select({
        reply: postReplies,
        user: users
      })
      .from(postReplies)
      .innerJoin(users, eq(postReplies.userId, users.id))
      .where(eq(postReplies.postId, postId))
      .orderBy(postReplies.createdAt);
    
    return result.map(row => ({
      ...row.reply,
      user: row.user
    }));
  }

  async createPostReply(reply: InsertPostReply): Promise<PostReply> {
    const [newReply] = await db.insert(postReplies).values(reply).returning();
    await db
      .update(communityPosts)
      .set({ replies: sql`${communityPosts.replies} + 1` })
      .where(eq(communityPosts.id, reply.postId));
    return newReply;
  }

  async getLeaderboard(limit: number): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.xp), desc(users.level))
      .limit(limit);
  }

  async updateUserXP(userId: string, xpToAdd: number): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    const newXP = (user.xp || 0) + xpToAdd;
    const newLevel = Math.floor(newXP / 200) + 1; // 200 XP per level
    
    const [updatedUser] = await db
      .update(users)
      .set({ 
        xp: newXP, 
        level: newLevel,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  // Journal operations
  async getJournalEntries(userId: string): Promise<JournalEntry[]> {
    return await db.select().from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt));
  }

  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const [newEntry] = await db
      .insert(journalEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getJournalStats(userId: string): Promise<{
    totalEntries: number;
    currentStreak: number;
    totalWords: number;
    averageWordsPerEntry: number;
    recentMoods: string[];
  }> {
    const entries = await this.getJournalEntries(userId);
    const totalEntries = entries.length;
    const totalWords = entries.reduce((acc, entry) => 
      acc + (entry.content?.split(' ').length || 0), 0);
    const averageWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    const sortedEntries = entries.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].createdAt);
      const daysDiff = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i) {
        currentStreak++;
      } else {
        break;
      }
    }

    const recentMoods = entries.slice(0, 7)
      .map(entry => entry.mood)
      .filter(Boolean) as string[];

    return {
      totalEntries,
      currentStreak,
      totalWords,
      averageWordsPerEntry,
      recentMoods
    };
  }

  // Settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db.select().from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async updateUserSettings(userId: string, settingsData: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    
    if (existing) {
      const [updated] = await db
        .update(userSettings)
        .set({ ...settingsData, updatedAt: new Date() })
        .where(eq(userSettings.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userSettings)
        .values({ userId, ...settingsData } as InsertUserSettings)
        .returning();
      return created;
    }
  }

  // Loot box operations
  async getUserLootBoxes(userId: string): Promise<LootBox[]> {
    return await db.select().from(lootBoxes)
      .where(eq(lootBoxes.userId, userId))
      .where(eq(lootBoxes.isOpened, false));
  }

  async openLootBox(userId: string, lootBoxId: number): Promise<LootItem[]> {
    // Mark loot box as opened
    await db
      .update(lootBoxes)
      .set({ isOpened: true, openedAt: new Date() })
      .where(eq(lootBoxes.id, lootBoxId))
      .where(eq(lootBoxes.userId, userId));

    // Get available loot items
    const availableItems = await db.select().from(lootItems);
    
    // Simulate loot box opening with random items
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items
    const selectedItems: LootItem[] = [];
    
    for (let i = 0; i < numItems; i++) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      selectedItems.push(randomItem);
      
      // Add to user inventory
      await db.insert(userLootItems).values({
        userId,
        lootItemId: randomItem.id,
        quantity: 1
      });
    }

    return selectedItems;
  }

  // Title operations
  async getAllTitles(): Promise<Title[]> {
    return await db.select().from(titles).orderBy(titles.requiredLevel);
  }

  async getUserTitles(userId: string): Promise<(UserTitle & { title: Title })[]> {
    return await db
      .select()
      .from(userTitles)
      .innerJoin(titles, eq(userTitles.titleId, titles.id))
      .where(eq(userTitles.userId, userId));
  }

  async unlockTitle(userId: string, titleId: number): Promise<UserTitle> {
    const [userTitle] = await db
      .insert(userTitles)
      .values({ userId, titleId })
      .returning();
    return userTitle;
  }

  async setActiveTitle(userId: string, titleId: number): Promise<void> {
    // Deactivate all titles for user
    await db
      .update(userTitles)
      .set({ isActive: false })
      .where(eq(userTitles.userId, userId));

    // Activate selected title
    await db
      .update(userTitles)
      .set({ isActive: true })
      .where(and(eq(userTitles.userId, userId), eq(userTitles.titleId, titleId)));
  }

  // Daily quest operations
  async getDailyQuests(): Promise<DailyQuest[]> {
    return await db.select().from(dailyQuests).where(eq(dailyQuests.isActive, true));
  }

  async getUserDailyQuests(userId: string): Promise<(UserDailyQuest & { quest: DailyQuest })[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await db
      .select()
      .from(userDailyQuests)
      .innerJoin(dailyQuests, eq(userDailyQuests.questId, dailyQuests.id))
      .where(and(
        eq(userDailyQuests.userId, userId),
        gte(userDailyQuests.assignedAt, today)
      ));
  }

  async assignDailyQuests(userId: string): Promise<UserDailyQuest[]> {
    const availableQuests = await this.getDailyQuests();
    const questsToAssign = availableQuests.slice(0, 3); // Assign 3 daily quests

    const assignedQuests: UserDailyQuest[] = [];
    for (const quest of questsToAssign) {
      const [userQuest] = await db
        .insert(userDailyQuests)
        .values({
          userId,
          questId: quest.id,
          progress: 0,
          isCompleted: false
        })
        .returning();
      assignedQuests.push(userQuest);
    }

    return assignedQuests;
  }

  async updateQuestProgress(userId: string, questId: number, progress: number): Promise<UserDailyQuest> {
    const [quest] = await db.select().from(dailyQuests).where(eq(dailyQuests.id, questId));
    const isCompleted = progress >= quest.requirement;

    const [userQuest] = await db
      .update(userDailyQuests)
      .set({ 
        progress,
        isCompleted,
        completedAt: isCompleted ? new Date() : null
      })
      .where(and(eq(userDailyQuests.userId, userId), eq(userDailyQuests.questId, questId)))
      .returning();

    // Award XP if quest completed
    if (isCompleted && !userQuest.isCompleted) {
      await this.awardXP(userId, quest.xpReward, "daily_quest");
    }

    return userQuest;
  }

  async completeQuest(userId: string, questId: number): Promise<UserDailyQuest> {
    const [quest] = await db.select().from(dailyQuests).where(eq(dailyQuests.id, questId));
    return await this.updateQuestProgress(userId, questId, quest.requirement);
  }

  // Badge operations
  async getAllBadges(): Promise<Badge[]> {
    return await db.select().from(badges).orderBy(badges.category);
  }

  async getUserBadges(userId: string): Promise<(UserBadge & { badge: Badge })[]> {
    return await db
      .select()
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId));
  }

  async awardBadge(userId: string, badgeId: number): Promise<UserBadge> {
    const [userBadge] = await db
      .insert(userBadges)
      .values({ userId, badgeId })
      .returning();
    return userBadge;
  }

  // XP and level management
  calculateLevel(xp: number): number {
    return Math.floor(xp / 200) + 1; // 200 XP per level
  }

  getXPForNextLevel(currentLevel: number): number {
    return currentLevel * 200;
  }

  async awardXP(userId: string, amount: number, source: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        xp: sql`${users.xp} + ${amount}`,
        level: sql`FLOOR((${users.xp} + ${amount}) / 200) + 1`
      })
      .where(eq(users.id, userId))
      .returning();

    // Check for achievements and level-based rewards
    await this.checkAndAwardAchievements(userId);

    return user;
  }
}

export const storage = new DatabaseStorage();

import { 
  users, regions, levels, cards, userProgress, userCards,
  type User, type InsertUser, type Region, type Level, type Card, 
  type UserProgress, type InsertUserProgress, type UserCard, type InsertUserCard,
  type UserWithProgress, type RegionWithProgress, type CardReward
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(userId: number, stats: { totalXP?: number; currentLevel?: number; totalCards?: number }): Promise<User>;
  getUserWithProgress(userId: number): Promise<UserWithProgress | undefined>;

  // Region operations
  getAllRegions(): Promise<Region[]>;
  getRegionsWithProgress(userId: number): Promise<RegionWithProgress[]>;

  // Level operations
  getAllLevels(): Promise<Level[]>;
  getLevelsByRegion(regionId: number): Promise<Level[]>;

  // Progress operations
  getUserProgress(userId: number): Promise<UserProgress[]>;
  completeLevel(userId: number, levelNumber: number): Promise<UserProgress>;
  getLevelProgress(userId: number, levelNumber: number): Promise<UserProgress | undefined>;

  // Card operations
  getAllCards(): Promise<Card[]>;
  getUserCards(userId: number): Promise<UserCard[]>;
  collectCard(userId: number, cardId: number): Promise<UserCard>;
  getAvailableRewards(userId: number): Promise<CardReward[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    try {
      // Check if data already exists
      const existingUsers = await db.select().from(users).limit(1);
      if (existingUsers.length > 0) {
        return; // Data already exists
      }

      // Initialize regions
      const regionsData = [
        { name: "Câmpia Plată", description: "Începutul călătoriei tale", emoji: "🌾", startLevel: 1, endLevel: 20, theme: "from-green-50 to-emerald-50", unlockRequirement: 0 },
        { name: "Podișul", description: "Provocări în creștere", emoji: "🏔️", startLevel: 21, endLevel: 40, theme: "from-yellow-50 to-orange-50", unlockRequirement: 20 },
        { name: "Podișuri Înalte", description: "Maestria în dezvoltare", emoji: "⛰️", startLevel: 41, endLevel: 60, theme: "from-blue-50 to-indigo-50", unlockRequirement: 40 },
        { name: "Munții Joși", description: "Provocări avansate", emoji: "🏔️", startLevel: 61, endLevel: 80, theme: "from-purple-50 to-pink-50", unlockRequirement: 60 },
        { name: "Vârfurile Munților", description: "Vârful măiestriei", emoji: "🏔️", startLevel: 81, endLevel: 100, theme: "from-gray-100 to-slate-100", unlockRequirement: 80 }
      ];

      await db.insert(regions).values(regionsData);

      // Personal development objectives by region
      const objectivesByRegion = {
        1: { // Câmpia Plată - Basic habits and awareness
          objectives: [
            "Începe o rutină de dimineață de 10 minute",
            "Scrie 3 lucruri pentru care ești recunoscător zilnic", 
            "Fă o plimbare de 15 minute în natură",
            "Citește 10 pagini dintr-o carte de dezvoltare personală",
            "Meditează 5 minute în liniște",
            "Identifică o emoție negativă și analizează-i cauza",
            "Spune 'nu' la o activitate care îți consumă energia",
            "Complimentează sincer o persoană din anturajul tău",
            "Organizează spațiul de lucru timp de 15 minute",
            "Reflectează asupra unei lecții învățate astăzi",
            "Practică respirația profundă pentru 5 minute",
            "Notează 3 obiective pe termen scurt",
            "Ascultă activ o conversație fără să întrerupi",
            "Dedică 20 de minute unei activități creative",
            "Elimină o distracție din rutina zilnică",
            "Exprimă recunoștința cuiva care te-a ajutat",
            "Învață un cuvânt nou într-o limbă străină",
            "Planifică ziua de mâine cu 3 priorități",
            "Fă un gest de bunătate pentru cineva",
            "Reflectează asupra progresului făcut în această săptămână"
          ],
          xpBase: 50,
          timeframes: ["daily", "daily", "daily", "daily", "daily", "daily", "daily", "daily", "daily", "daily", 
                      "daily", "weekly", "daily", "daily", "daily", "daily", "daily", "daily", "daily", "weekly"]
        },
        2: { // Platoul Mijlociu - Building discipline
          objectives: [
            "Dezvoltă o rutină de exerciții de 30 de minute",
            "Citește o carte completă despre leadership",
            "Ține un jurnal de reflecție pentru o săptămână",
            "Practică o conversație dificilă cu cineva apropiat",
            "Înregistrează și analizează cum îți petreci timpul 3 zile",
            "Creează un plan de dezvoltare pentru următoarele 3 luni",
            "Învață o abilitate nouă timp de o săptămână",
            "Organizează și curăță complet locuința",
            "Planifică și pregătește mesele pentru o săptămână",
            "Identifică și lucrează la o frică personală",
            "Stabilește granițe clare în relațiile personale",
            "Dezvoltă un sistem de organizare pentru proiectele tale",
            "Practică spunerea 'nu' politicos dar ferm",
            "Analizează și îmbunătățește calitatea somnului",
            "Creează un buget personal și urmărește-l o săptămână",
            "Dezvoltă o rutină de seară relaxantă",
            "Practică ascultarea activă în toate conversațiile",
            "Stabilește și urmărește 3 obiective măsurabile",
            "Elimină o obișnuință negativă timp de o săptămână",
            "Reflectează asupra valorilor tale fundamentale"
          ],
          xpBase: 75,
          timeframes: ["weekly", "weekly", "weekly", "weekly", "weekly", "monthly", "weekly", "weekly", "weekly", "weekly",
                      "weekly", "weekly", "weekly", "weekly", "weekly", "weekly", "weekly", "weekly", "weekly", "monthly"]
        },
        3: { // Platoul Înalt - Strategic thinking  
          objectives: [
            "Dezvoltă un plan de carieră pe următorii 2 ani",
            "Construiește o rețea profesională cu 10 persoane noi",
            "Creează un sistem de învățare continuă",
            "Dezvoltă abilități de comunicare publică",
            "Analizează și optimizează relațiile din viața ta",
            "Stabilește obiective financiare pe termen mediu",
            "Dezvoltă un proiect personal semnificativ",
            "Practică mindfulness-ul zilnic timp de o lună",
            "Creează un plan de dezvoltare a abilităților emoționale",
            "Analizează și îmbunătățește productivitatea personală",
            "Dezvoltă abilități de rezolvare a conflictelor",
            "Construiește o rutină de auto-reflecție profundă",
            "Stabilește și urmărește obiective de sănătate holistică",
            "Dezvoltă abilități de gândire critică",
            "Creează un sistem de feedback pentru dezvoltarea personală",
            "Analizează și îmbunătățește calitatea relațiilor",
            "Dezvoltă abilități de adaptabilitate și flexibilitate",
            "Construiește o viziune clară asupra viitorului dorit",
            "Practică gratitudinea și aprecierea profundă",
            "Dezvoltă un plan de contribuție la comunitate"
          ],
          xpBase: 100,
          timeframes: ["monthly", "monthly", "monthly", "monthly", "monthly", "monthly", "monthly", "monthly", "monthly", "monthly",
                      "monthly", "monthly", "monthly", "monthly", "monthly", "monthly", "monthly", "monthly", "monthly", "monthly"]
        },
        4: { // Munții de Început - Advanced personal mastery
          objectives: [
            "Dezvoltă un sistem complet de management al timpului",
            "Construiește un plan de dezvoltare spirituală pe termen lung",
            "Creează un program de mentorat pentru alții",
            "Dezvoltă abilități avansate de leadership și influență",
            "Analizează și transformă convingerile limitative",
            "Stabilește și implementează un plan de impact social",
            "Dezvoltă expertiza într-un domeniu ales",
            "Construiește relații profunde și semnificative",
            "Creează un sistem de dezvoltare a creativității",
            "Dezvoltă abilități avansate de luare a deciziilor",
            "Analizează și optimizează sistemele din viața ta",
            "Construiește o viziune și misiune personală clară",
            "Dezvoltă abilități de gestionare a stresului complex",
            "Creează un plan de dezvoltare a inteligenței emoționale",
            "Analizează și îmbunătățește capacitatea de adaptare",
            "Dezvoltă abilități de comunicare la nivel expert",
            "Construiește un sistem de învățare din eșecuri",
            "Creează un plan de dezvoltare a potențialului complet",
            "Dezvoltă abilități de mentorat și coaching",
            "Analizează și perfecționează filosofia personală de viață"
          ],
          xpBase: 150,
          timeframes: ["long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term",
                      "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term"]
        },
        5: { // Vârfurile Munților - Mastery and wisdom
          objectives: [
            "Devino un lider transformațional în domeniul tău",
            "Construiește un sistem complet de înțelepciune personală",
            "Dezvoltă capacitatea de a inspira și transforma vieți",
            "Creează un moștenire durabilă prin contribuțiile tale",
            "Analizează și integrează toate aspectele dezvoltării personale",
            "Stabilește un impact semnificativ la nivel social",
            "Dezvoltă măiestria în artele relaționale și comunicării",
            "Construiește un sistem complet de echilibru viață-muncă",
            "Creează un program de dezvoltare pentru generația următoare",
            "Dezvoltă înțelepciunea pentru a ghida deciziile complexe",
            "Analizează și transcende limitările personale fundamentale",
            "Construiește un sistem de contribuție la schimbarea pozitivă",
            "Dezvoltă capacitatea de a vedea conexiunile profunde",
            "Creează un plan de realizare a potențialului maxim",
            "Analizează și integrează lecțiile vieții într-o filosofie coerentă",
            "Dezvoltă abilitatea de a transforma provocările în oportunități",
            "Construiește un sistem de împărtășire a înțelepciunii",
            "Creează un impact pozitiv durabil în lume",
            "Dezvoltă măiestria în arta de a trăi autentic",
            "Analizează și realizează integrarea completă a ființei"
          ],
          xpBase: 200,
          timeframes: ["long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term",
                      "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term", "long-term"]
        }
      };

      // Initialize levels with personal development objectives
      const levelsData = [];
      for (let i = 1; i <= 100; i++) {
        const regionId = Math.ceil(i / 20);
        const levelInRegion = (i - 1) % 20;
        const regionObjectives = objectivesByRegion[regionId];
        
        const isRewardLevel = i % 5 === 0;
        const isBossLevel = i % 20 === 0;
        
        const objective = regionObjectives.objectives[levelInRegion];
        const timeframe = regionObjectives.timeframes[levelInRegion];
        const baseXP = regionObjectives.xpBase;
        const xpReward = isBossLevel ? baseXP * 3 : isRewardLevel ? baseXP * 2 : baseXP;
        
        // Determine difficulty based on region and level position
        let difficulty = "medium";
        if (regionId === 1) difficulty = levelInRegion < 10 ? "easy" : "medium";
        else if (regionId === 2) difficulty = "medium";
        else if (regionId === 3) difficulty = levelInRegion < 10 ? "medium" : "hard";
        else if (regionId === 4) difficulty = "hard";
        else difficulty = levelInRegion < 10 ? "hard" : "expert";
        
        if (isBossLevel) difficulty = "expert";
        
        levelsData.push({
          levelNumber: i,
          regionId,
          name: `Nivel ${i}${isBossLevel ? " - Provocare Finală" : isRewardLevel ? " - Obiectiv Special" : ""}`,
          objective,
          description: `${objective} - Un obiectiv de dezvoltare personală care îți va îmbunătăți ${regionId === 1 ? 'obiceiurile de bază' : regionId === 2 ? 'disciplina personală' : regionId === 3 ? 'gândirea strategică' : regionId === 4 ? 'măiestria personală' : 'înțelepciunea și impactul'}`,
          difficulty,
          timeframe,
          isRewardLevel,
          isBossLevel,
          xpReward
        });
      }

      await db.insert(levels).values(levelsData);

      // Initialize cards
      const cardsData = [
        { name: "Carte Motivațională", description: "Succesul este suma eforturilor mici repetate zi de zi.", rarity: "common", type: "motivational", unlockLevel: 5, isUnique: false },
        { name: "Progres Constant", description: "Fiecare pas te aduce mai aproape de obiectiv.", rarity: "common", type: "motivational", unlockLevel: 10, isUnique: false },
        { name: "Determinare", description: "Persistența este cheia succesului.", rarity: "common", type: "motivational", unlockLevel: 15, isUnique: false },
        { name: "Maestrul Câmpiei", description: "Ai cucerit prima regiune cu succes!", rarity: "rare", type: "boss", unlockLevel: 20, isUnique: true },
        { name: "Cuceritor de Podișuri", description: "Provocările înălțimii nu te opresc!", rarity: "rare", type: "boss", unlockLevel: 40, isUnique: true },
        { name: "Stăpânul Înălțimilor", description: "Înălțimile nu-ți fac teamă!", rarity: "epic", type: "boss", unlockLevel: 60, isUnique: true },
        { name: "Domnul Munților", description: "Munții se supun puterii tale!", rarity: "epic", type: "boss", unlockLevel: 80, isUnique: true },
        { name: "Legenda Vârfurilor", description: "Ai atins vârful măiestriei absolute!", rarity: "legendary", type: "boss", unlockLevel: 100, isUnique: true },
      ];

      await db.insert(cards).values(cardsData);

      // Create default user
      const [defaultUser] = await db.insert(users).values({
        username: "player",
        password: "password",
        totalXP: 37,
        currentLevel: 1,
        totalCards: 0
      }).returning();

      // Add some initial progress
      const progressData = [];
      for (let i = 1; i <= 12; i++) {
        progressData.push({
          userId: defaultUser.id,
          levelNumber: i,
          completed: true
        });
      }

      await db.insert(userProgress).values(progressData);
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserStats(userId: number, stats: { totalXP?: number; currentLevel?: number; totalCards?: number }): Promise<User> {
    const [user] = await db
      .update(users)
      .set(stats)
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async getUserWithProgress(userId: number): Promise<UserWithProgress | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const progress = await this.getUserProgress(userId);
    const completedLevels = progress.filter(p => p.completed).length;
    const nextRewardLevel = Math.ceil((completedLevels + 1) / 5) * 5;
    const progressPercentage = (completedLevels / 100) * 100;

    return {
      ...user,
      completedLevels,
      nextRewardLevel,
      progressPercentage
    };
  }

  async getAllRegions(): Promise<Region[]> {
    return await db.select().from(regions);
  }

  async getRegionsWithProgress(userId: number): Promise<RegionWithProgress[]> {
    const allRegions = await this.getAllRegions();
    const progress = await this.getUserProgress(userId);
    const allLevels = await this.getAllLevels();
    const completedLevelsSet = new Set(progress.filter(p => p.completed).map(p => p.levelNumber));
    const maxCompletedLevel = Math.max(0, ...Array.from(completedLevelsSet));

    return allRegions.map(region => {
      const regionLevels = allLevels
        .filter(level => level.levelNumber >= region.startLevel && level.levelNumber <= region.endLevel)
        .map(level => ({
          ...level,
          completed: completedLevelsSet.has(level.levelNumber),
          isAvailable: level.levelNumber <= maxCompletedLevel + 1
        }));

      const completedInRegion = regionLevels.filter(l => l.completed).length;
      const isUnlocked = maxCompletedLevel >= region.unlockRequirement;

      return {
        ...region,
        completedLevels: completedInRegion,
        totalLevels: regionLevels.length,
        isUnlocked,
        levels: regionLevels
      };
    });
  }

  async getAllLevels(): Promise<Level[]> {
    return await db.select().from(levels);
  }

  async getLevelsByRegion(regionId: number): Promise<Level[]> {
    return await db.select().from(levels).where(eq(levels.regionId, regionId));
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async completeLevel(userId: number, levelNumber: number): Promise<UserProgress> {
    const existing = await this.getLevelProgress(userId, levelNumber);
    
    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({ completed: true, completedAt: new Date() })
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    }

    const [progress] = await db
      .insert(userProgress)
      .values({
        userId,
        levelNumber,
        completed: true
      })
      .returning();

    // Update user stats
    const allLevels = await this.getAllLevels();
    const level = allLevels.find(l => l.levelNumber === levelNumber);
    if (level) {
      const user = await this.getUser(userId);
      if (user) {
        const newXP = user.totalXP + level.xpReward;
        const newLevel = Math.max(user.currentLevel, levelNumber);
        await this.updateUserStats(userId, { totalXP: newXP, currentLevel: newLevel });
      }
    }

    return progress;
  }

  async getLevelProgress(userId: number, levelNumber: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .where(eq(userProgress.levelNumber, levelNumber));
    return progress || undefined;
  }

  async getAllCards(): Promise<Card[]> {
    return await db.select().from(cards);
  }

  async getUserCards(userId: number): Promise<UserCard[]> {
    return await db.select().from(userCards).where(eq(userCards.userId, userId));
  }

  async collectCard(userId: number, cardId: number): Promise<UserCard> {
    const [userCard] = await db
      .insert(userCards)
      .values({
        userId,
        cardId
      })
      .returning();

    // Update user total cards
    const user = await this.getUser(userId);
    if (user) {
      await this.updateUserStats(userId, { totalCards: user.totalCards + 1 });
    }

    return userCard;
  }

  async getAvailableRewards(userId: number): Promise<CardReward[]> {
    const progress = await this.getUserProgress(userId);
    const completedLevels = progress.filter(p => p.completed).map(p => p.levelNumber);
    const userCardsList = await this.getUserCards(userId);
    const collectedCardIds = new Set(userCardsList.map(uc => uc.cardId));
    const allCards = await this.getAllCards();
    
    const availableCards: CardReward[] = [];
    
    for (const levelNumber of completedLevels) {
      const availableCard = allCards.find(card => 
        card.unlockLevel === levelNumber && !collectedCardIds.has(card.id)
      );
      
      if (availableCard) {
        availableCards.push({
          card: availableCard,
          earnedAt: levelNumber
        });
      }
    }
    
    return availableCards;
  }
}

export const storage = new DatabaseStorage();

import type { Express, RequestHandler } from "express";
import { storage } from "./storage";

// Mock user pentru testare
const MOCK_USER = {
  id: "test-user-123",
  email: "test@transcendup.com",
  firstName: "Test",
  lastName: "User",
  profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face"
};

export async function setupMockAuth(app: Express) {
  // Asigură-te că utilizatorul mock există în baza de date
  try {
    let user = await storage.getUser(MOCK_USER.id);
    if (!user) {
      user = await storage.upsertUser(MOCK_USER);
    }
  } catch (error) {
    console.error("Error setting up mock user:", error);
  }

  // Mock login endpoint
  app.get("/api/login", (req, res) => {
    (req as any).user = MOCK_USER;
    res.redirect("/");
  });

  // Mock logout endpoint
  app.get("/api/logout", (req, res) => {
    (req as any).user = null;
    res.redirect("/");
  });

  // Mock user endpoint
  app.get("/api/auth/user", async (req, res) => {
    try {
      const user = await storage.getUser(MOCK_USER.id);
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

// Mock authentication middleware
export const mockIsAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const user = await storage.getUser(MOCK_USER.id);
    if (user) {
      (req as any).user = { claims: { sub: MOCK_USER.id } };
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.error("Mock auth error:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
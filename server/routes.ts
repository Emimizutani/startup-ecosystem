import { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "db";
import { profiles, events, matches, messages, users } from "db/schema";
import { eq, and, desc, or } from "drizzle-orm";

declare global {
  namespace Express {
    interface User {
      id: number;
    }
  }
}

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Get all profiles (public access)
  app.get("/api/profiles", async (_req, res) => {
    try {
      const allProfiles = await db
        .select({
          id: profiles.id,
          userId: profiles.userId,
          name: profiles.name,
          bio: profiles.bio,
          skills: profiles.skills,
          location: profiles.location,
          experience: profiles.experience,
          type: users.type,
          updatedAt: profiles.updatedAt,
          contactEmail: profiles.contactEmail,
        })
        .from(profiles)
        .leftJoin(users, eq(profiles.userId, users.id))
        .orderBy(desc(profiles.updatedAt));
      res.json(allProfiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Error loading profiles" });
    }
  });

  // Get profile by user ID (public access)
  app.get("/api/profiles/:userId", async (req, res) => {
    try {
      const [profile] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, parseInt(req.params.userId)))
        .limit(1);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Error loading profile" });
    }
  });

  // Update or create profile (requires authentication)
  app.post("/api/profiles", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const existingProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, req.user.id))
        .limit(1);

      if (existingProfile.length > 0) {
        // Update existing profile
        const [updated] = await db
          .update(profiles)
          .set({ ...req.body, updatedAt: new Date() })
          .where(eq(profiles.userId, req.user.id))
          .returning();
        return res.json(updated);
      }

      // Create new profile
      const [profile] = await db
        .insert(profiles)
        .values({ ...req.body, userId: req.user.id })
        .returning();
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  });

  // Events (public access)
  app.get("/api/events", async (_req, res) => {
    try {
      const allEvents = await db
        .select()
        .from(events)
        .orderBy(desc(events.date));
      res.json(allEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Error loading events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const [event] = await db
        .insert(events)
        .values({ ...req.body, creatorId: req.user.id })
        .returning();
      res.json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Error creating event" });
    }
  });

  // Matches (requires authentication)
  app.get("/api/matches", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userMatches = await db
        .select()
        .from(matches)
        .where(
          or(
            eq(matches.studentId, req.user.id),
            eq(matches.companyId, req.user.id)
          )
        );
      res.json(userMatches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Error loading matches" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const [match] = await db
        .insert(matches)
        .values(req.body)
        .returning();
      res.json(match);
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Error creating match" });
    }
  });

  // Messages (requires authentication)
  app.get("/api/messages/:matchId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const matchMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.matchId, parseInt(req.params.matchId)))
        .orderBy(desc(messages.createdAt));
      res.json(matchMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error loading messages" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const [message] = await db
        .insert(messages)
        .values({ ...req.body, senderId: req.user.id })
        .returning();
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Error creating message" });
    }
  });
}

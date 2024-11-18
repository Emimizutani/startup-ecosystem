import { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "db";
import { profiles, events, matches, messages } from "db/schema";
import { eq, and, desc, or } from "drizzle-orm";

export function registerRoutes(app: Express) {
  setupAuth(app);

  // Profiles
  app.get("/api/profiles/:userId", async (req, res) => {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, parseInt(req.params.userId)))
      .limit(1);
    res.json(profile);
  });

  app.post("/api/profiles", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const [profile] = await db
      .insert(profiles)
      .values({ ...req.body, userId: req.user.id })
      .returning();
    res.json(profile);
  });

  // Events
  app.get("/api/events", async (req, res) => {
    const allEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.date));
    res.json(allEvents);
  });

  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const [event] = await db
      .insert(events)
      .values({ ...req.body, creatorId: req.user.id })
      .returning();
    res.json(event);
  });

  // Matches
  app.get("/api/matches", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
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
  });

  app.post("/api/matches", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const [match] = await db
      .insert(matches)
      .values(req.body)
      .returning();
    res.json(match);
  });

  // Messages
  app.get("/api/messages/:matchId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const matchMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.matchId, parseInt(req.params.matchId)))
      .orderBy(desc(messages.createdAt));
    res.json(matchMessages);
  });

  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const [message] = await db
      .insert(messages)
      .values({ ...req.body, senderId: req.user.id })
      .returning();
    res.json(message);
  });
}

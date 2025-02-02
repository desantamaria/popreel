import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  bigint,
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";

// Tables
export const users = pgTable("users", {
  id: text("clerk_id").primaryKey(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: varchar("full_name", { length: 255 }),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  metadata: jsonb("metadata"),
  embedding: vector("embedding", {
    dimensions: 768,
  }),
  isVerified: boolean("is_verified").default(false),
  isPrivate: boolean("is_private").default(false),
  lastSeenAt: timestamp("last_seen_at").notNull().default(new Date()),
  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  caption: text("caption"),
  videoUrl: text("video_url").notNull().unique(),
  videoSize: bigint("video_size", { mode: "number" }),
  videoLength: text("video_length"),
  transcription: text("transcription"),
  summary: text("summary"),
  tags: text("tags").array(),
  metadata: jsonb("metadata").$type<Record<string, unknown> | null>(),
  embedding: vector("embedding", {
    dimensions: 768,
  }),
  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

export const videoAnalytics = pgTable("video_analytics", {
  id: uuid("id").defaultRandom().primaryKey(),
  videoId: uuid("video_id").references(() => videos.id),
  totalViews: bigint("total_views", { mode: "number" }),
  totalLikes: bigint("total_likes", { mode: "number" }),
  totalComments: bigint("total_comments", { mode: "number" }),
  totalBookmarks: bigint("total_bookmarks", { mode: "number" }),
  totalShares: bigint("total_shares", { mode: "number" }),
  audienceDemographic: jsonb("audience_demographic"),
  hourlyViews: jsonb("hourly_views"),
  dailyViews: jsonb("daily_views"),
  popularityScore: jsonb("popularity_score"),
  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

export const videoInteractions = pgTable("video_interactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id),
  videoId: uuid("video_id").references(() => videos.id),
  interactionType: varchar("interaction_type", { length: 30 }),
  metadata: jsonb("metadata"),
  viewDuration: bigint("view_Duration", { mode: "number" }),
  watchPercentage: bigint("watch_percentage", { mode: "number" }),
  interactionStrength: bigint("interaction_strength", { mode: "number" }),
  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => users.id),
  videoId: uuid("video_id").references(() => videos.id),
  content: text("content"),
  totalLikes: bigint("total_likes", { mode: "number" }),
  createdAt: timestamp("created_at").notNull().default(new Date()),
  updatedAt: timestamp("updated_at").notNull().default(new Date()),
});

// Types
export type UserSelect = InferSelectModel<typeof users>;
export type VideoSelect = InferSelectModel<typeof videos>;
export type CommentSelect = InferSelectModel<typeof comments>;
export type VideoInteractionSelect = InferSelectModel<typeof videoInteractions>;

export type CreateUserInput = InferInsertModel<typeof users>;
export type CreateVideoInput = InferInsertModel<typeof videos>;
export type CreateCommentInput = InferInsertModel<typeof comments>;

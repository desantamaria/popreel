import { InferSelectModel } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  vector,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  username: varchar("username").notNull().unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const videos = pgTable(
  "videos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.clerkId),
    caption: text("caption"),
    videoUrl: text("video_url").notNull(),
    metadata: jsonb("metadata"),
    embedding: vector("embedding", { dimensions: 1408 }), // 1408 for Google multimodal embeddings
    viewsCount: bigint("views_count", { mode: "number" }),
    likesCount: bigint("likes_count", { mode: "number" }),
    commentsCount: bigint("comments_count", { mode: "number" }),
    sharesCount: bigint("shares_count", { mode: "number" }),
    bookmarksCount: bigint("bookmarks_count", { mode: "number" }),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => ({
    embeddingIndex: index("embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops")
    ),
  })
);

export const views = pgTable("views", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.clerkId),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id),
  watchDuration: integer("watch_duration"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const likes = pgTable("likes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.clerkId),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.clerkId),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id),
  content: text("content"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const shares = pgTable("shares", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.clerkId),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id),
  sharePlatform: varchar("share_platform"),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const bookmarks = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.clerkId),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export type User = InferSelectModel<typeof users>;
export type Video = InferSelectModel<typeof videos>;
export type View = InferSelectModel<typeof views>;
export type Like = InferSelectModel<typeof likes>;
export type Comment = InferSelectModel<typeof comments>;
export type Share = InferSelectModel<typeof shares>;
export type Bookmark = InferSelectModel<typeof bookmarks>;

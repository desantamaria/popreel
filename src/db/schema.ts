import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
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

// Tables
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  username: varchar("username").notNull().unique(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  metadata: jsonb("metadata"),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  videos: many(videos),
  views: many(views),
  likes: many(likes),
  comments: many(comments),
  shares: many(shares),
  bookmarks: many(bookmarks),
}));

export const videosRelations = relations(videos, ({ one, many }) => ({
  users: one(users, {
    fields: [videos.userId],
    references: [users.clerkId],
  }),
  views: many(views),
  likes: many(likes),
  comments: many(comments),
  shares: many(shares),
  bookmarks: many(bookmarks),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  users: one(users, {
    fields: [likes.userId],
    references: [users.clerkId],
  }),
  videos: one(videos, {
    fields: [likes.videoId],
    references: [videos.id],
  }),
}));

export const commentsRelations = relations(views, ({ one }) => ({
  users: one(users, {
    fields: [views.userId],
    references: [users.clerkId],
  }),
  videos: one(videos, {
    fields: [views.videoId],
    references: [videos.id],
  }),
}));

export const sharesRelations = relations(shares, ({ one }) => ({
  users: one(users, {
    fields: [shares.userId],
    references: [users.clerkId],
  }),
  videos: one(videos, {
    fields: [shares.videoId],
    references: [videos.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  users: one(users, {
    fields: [bookmarks.userId],
    references: [users.clerkId],
  }),
  videos: one(videos, {
    fields: [bookmarks.videoId],
    references: [videos.id],
  }),
}));

// Types
export type UserAggregation = InferSelectModel<typeof users>;
export type VideoAggregation = InferSelectModel<typeof videos>;
export type ViewAggregation = InferSelectModel<typeof views>;
export type LikeAggregation = InferSelectModel<typeof likes>;
export type CommentAggregation = InferSelectModel<typeof comments>;
export type ShareAggregation = InferSelectModel<typeof shares>;
export type BookmarkAggregation = InferSelectModel<typeof bookmarks>;

export type CreateUserInput = InferInsertModel<typeof users>;
export type CreateVideoInput = InferInsertModel<typeof videos>;
export type CreateViewInput = InferInsertModel<typeof views>;
export type CreateLikeInput = InferInsertModel<typeof likes>;
export type CreateCommentInput = InferInsertModel<typeof comments>;
export type CreateShareInput = InferInsertModel<typeof shares>;
export type CreateBookmarkInput = InferInsertModel<typeof bookmarks>;

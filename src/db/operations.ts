import { Logger } from "@/utils/logger";
import {
  CreateUserInput,
  CreateVideoInput,
  CreateViewInput,
  CreateLikeInput,
  CreateCommentInput,
  CreateShareInput,
  CreateBookmarkInput,
  users,
  videos,
  views,
  likes,
  comments,
  shares,
  bookmarks,
} from "./schema";
import { db } from ".";
import { eq } from "drizzle-orm";

const logger = new Logger("db:operations");

// User Operations
export async function createUser(input: CreateUserInput) {
  const { ...userData } = input;
  const user = await db.insert(users).values(userData).returning();
  return user[0];
}

export async function getUser(id: string) {
  const user = await db.select().from(users).where(eq(users.id, id));
  return user[0];
}

export async function updateUser(id: string, input: Partial<CreateUserInput>) {
  await db.update(users).set(input).where(eq(users.id, id));
}

export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id));
}

// Video Operations
export async function createVideo(input: CreateVideoInput) {
  const { ...videoData } = input;
  const video = await db.insert(videos).values(videoData).returning();
  return video[0];
}

export async function getVideo(id: string) {
  const video = await db.select().from(videos).where(eq(videos.id, id));
  return video[0];
}

export async function updateVideo(
  id: string,
  input: Partial<CreateVideoInput>
) {
  await db.update(videos).set(input).where(eq(videos.id, id));
}

export async function deleteVideo(id: string) {
  await db.delete(videos).where(eq(videos.id, id));
}

// View Operations
export async function createView(input: CreateViewInput) {
  const { ...viewData } = input;
  const view = await db.insert(views).values(viewData).returning();
  return view[0];
}

export async function getView(id: string) {
  const view = await db.select().from(views).where(eq(views.id, id));
  return view[0];
}

export async function updateView(id: string, input: Partial<CreateViewInput>) {
  await db.update(views).set(input).where(eq(views.id, id));
}

export async function deleteView(id: string) {
  await db.delete(views).where(eq(views.id, id));
}

// Like Operations
export async function createLike(input: CreateLikeInput) {
  const { ...likeData } = input;
  const like = await db.insert(likes).values(likeData).returning();
  return like[0];
}

export async function getLike(id: string) {
  const like = await db.select().from(likes).where(eq(likes.id, id));
  return like[0];
}

export async function updateLike(id: string, input: Partial<CreateLikeInput>) {
  await db.update(likes).set(input).where(eq(likes.id, id));
}

export async function deleteLike(id: string) {
  await db.delete(likes).where(eq(likes.id, id));
}

// Comment Operations
export async function createComment(input: CreateCommentInput) {
  const { ...commentData } = input;
  const comment = await db.insert(comments).values(commentData).returning();
  return comment[0];
}

export async function getComment(id: string) {
  const comment = await db.select().from(comments).where(eq(comments.id, id));
  return comment[0];
}

export async function updateComment(
  id: string,
  input: Partial<CreateCommentInput>
) {
  await db.update(comments).set(input).where(eq(comments.id, id));
}

export async function deleteComment(id: string) {
  await db.delete(comments).where(eq(comments.id, id));
}

// Share Operations
export async function createShare(input: CreateShareInput) {
  const { ...shareData } = input;
  const share = await db.insert(shares).values(shareData).returning();
  return share[0];
}

export async function getShare(id: string) {
  const share = await db.select().from(shares).where(eq(shares.id, id));
  return share[0];
}

export async function updateShare(
  id: string,
  input: Partial<CreateShareInput>
) {
  await db.update(shares).set(input).where(eq(shares.id, id));
}

export async function deleteShare(id: string) {
  await db.delete(shares).where(eq(shares.id, id));
}

// Bookmark Operations
export async function createBookmark(input: CreateBookmarkInput) {
  const { ...bookmarkData } = input;
  const bookmark = await db.insert(bookmarks).values(bookmarkData).returning();
  return bookmark[0];
}

export async function getBookmark(id: string) {
  const bookmark = await db
    .select()
    .from(bookmarks)
    .where(eq(bookmarks.id, id));
  return bookmark[0];
}

export async function updateBookmark(
  id: string,
  input: Partial<CreateBookmarkInput>
) {
  await db.update(bookmarks).set(input).where(eq(bookmarks.id, id));
}

export async function deleteBookmark(id: string) {
  await db.delete(bookmarks).where(eq(bookmarks.id, id));
}

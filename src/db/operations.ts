import { Logger } from "@/utils/logger";
import { eq } from "drizzle-orm";
import { db } from ".";

import { Delete } from "@/lib/vercel-blob";
import {
  comments,
  CreateCommentInput,
  CreateUserInput,
  CreateVideoInput,
  users,
  videos,
} from "./schema";

const logger = new Logger("db:operations");

// User Operations
export async function createUser(input: CreateUserInput) {
  const user = await db.insert(users).values(input).returning();
  return user[0].id;
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
  const video = await getVideo(id);
  const result = await Delete(video.videoUrl);
  if (!result) {
    logger.error("Error Deleting File from Vercel Blob");
  }
  await db.delete(videos).where(eq(videos.id, id));
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

"use server";

import { db } from "@/db";
import { videoAnalytics } from "@/db/schema";
import { VideoInteractionService } from "@/lib/services/interaction";
import { Logger } from "@/utils/logger";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const logger = new Logger("actions:video-interactions");

export async function getVideoInteractions(videoId: string) {
  try {
    const analytics = await db
      .select()
      .from(videoAnalytics)
      .where(eq(videoAnalytics.videoId, videoId))
      .limit(1);

    return analytics[0];
  } catch (error) {
    logger.error("Failed to fetch video analytics");
  }
}

export async function handleView(videoId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    await VideoInteractionService.recordView(userId, videoId);
  } catch (error) {
    logger.error("Failed to like/unlike video");
  }
}

export async function toggleLike(videoId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No Logged In User");
  }

  try {
    const result = await VideoInteractionService.toggleLike(userId, videoId);
    revalidatePath("/feed");
    return result;
  } catch (error) {
    logger.error("Failed to like/unlike video");
    throw new Error("An error occurred", { cause: error });
  }
}

export async function toggleBookmark(videoId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    return await VideoInteractionService.toggleBookmark(userId, videoId);
  } catch (error) {
    logger.error("Failed to bookmark video");
  }
}

export async function shareVideo(videoId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    await VideoInteractionService.recordShare(userId, videoId);
  } catch (error) {
    logger.error("Failed to share video");
  }
}

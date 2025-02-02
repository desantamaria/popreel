"use server";

import { auth } from "@clerk/nextjs/server";
import { Logger } from "@/utils/logger";
import { VideoInteractionService } from "@/lib/services/interaction";

const logger = new Logger("actions:video-interactions");

export async function toggleLike(videoId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    await VideoInteractionService.toggleLike(userId, videoId);
  } catch (error) {
    logger.error("Failed to like/unlike video");
  }
}

export async function toggleBookmark(videoId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { message: "No Logged In User" };
  }

  try {
    await VideoInteractionService.toggleBookmark(userId, videoId);
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

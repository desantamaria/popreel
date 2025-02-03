"use server";

import { VideoRecommendationService } from "@/lib/services/recommendation";
import { VideoService } from "@/lib/services/video";
import { Logger } from "@/utils/logger";
import { auth } from "@clerk/nextjs/server";

const logger = new Logger("actions:recommendations");

export async function getRecommendedVideos(limit?: number) {
  const { userId } = await auth();

  if (!userId) {
    logger.info("No logged in user, returning empty recommendations");
    return [];
  }

  try {
    const recommendations =
      await VideoRecommendationService.getRecommendedVideos(userId, limit);
    return recommendations;
  } catch (error) {
    logger.error("Failed to get recommended videos", { error });
    throw error;
  }
}

// Get personalized video feed combining recommendations and recent videos
export async function getPersonalizedFeed(limit: number) {
  const { userId } = await auth();

  if (!userId) {
    logger.info("No logged in user, returning recent videos only");
    return VideoService.listAllVideos();
  }

  try {
    // Get recommendations and recent videos in parallel
    const [recommendations, recentVideos] = await Promise.all([
      VideoRecommendationService.getRecommendedVideos(userId, limit),
      VideoService.listAllVideos(),
    ]);

    // Combine and deduplicate videos
    const seenIds = new Set();
    const combinedFeed = [];

    // Add recommendations first
    for (const video of recommendations) {
      if (!seenIds.has(video.id)) {
        seenIds.add(video.id);
        combinedFeed.push(video);
      }
    }

    // Fill remaining slots with recent videos
    for (const video of recentVideos) {
      if (!seenIds.has(video.id)) {
        seenIds.add(video.id);
        combinedFeed.push(video);
      }
    }

    return combinedFeed;
  } catch (error) {
    logger.error("Failed to get personalized feed", { error });
    throw error;
  }
}

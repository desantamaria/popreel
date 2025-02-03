import { and, eq, inArray, isNotNull, not, desc } from "drizzle-orm";
import { db } from "@/db";
import { videos, videoInteractions, users } from "@/db/schema";
import { Logger } from "@/utils/logger";
import { VideoMetadata } from "./video";

const logger = new Logger("VideoRecommendationService");

interface WeightedInteraction {
  videoId: string;
  interactionStrength: number;
  embedding: number[];
}

export class VideoRecommendationService {
  // Calculate weighted average embedding based on user interactions
  private static async calculateUserInteractionEmbedding(
    userId: string
  ): Promise<number[] | null> {
    try {
      logger.debug("Determining Embeddings based on user interaction");

      // Get all user interactions with videos
      const userInteractions = await db
        .select({
          videoId: videoInteractions.videoId,
          interactionType: videoInteractions.interactionType,
          interactionStrength: videoInteractions.interactionStrength,
          watchPercentage: videoInteractions.watchPercentage,
        })
        .from(videoInteractions)
        .where(eq(videoInteractions.userId, userId));

      if (!userInteractions.length) {
        return null;
      }

      // Get videos with embeddings
      const videoIds = Array.from(
        new Set(
          userInteractions
            .map((interaction) => interaction.videoId)
            .filter((id) => id !== null)
        )
      );
      const videosData = await db
        .select({
          id: videos.id,
          embedding: videos.embedding,
        })
        .from(videos)
        .where(and(inArray(videos.id, videoIds), isNotNull(videos.embedding)));

      // Create map of video embeddings
      const videoEmbeddings = new Map(
        videosData.map((video) => [video.id, video.embedding])
      );

      // Calculate weighted embeddings
      const weightedEmbeddings: WeightedInteraction[] =
        userInteractions
          .filter((interaction) => {
            if (interaction.videoId) {
              const embedding = videoEmbeddings.get(interaction.videoId);
              return (
                embedding !== undefined &&
                embedding !== null &&
                interaction !== undefined
              );
            }
          })
          .map((interaction) => {
            if (interaction.videoId) {
              return {
                videoId: interaction.videoId,
                interactionStrength: interaction.interactionStrength,
                embedding: videoEmbeddings.get(interaction.videoId)!,
              };
            }
          })
          .filter(
            (interaction): interaction is WeightedInteraction =>
              interaction !== undefined
          ) || [];

      if (!weightedEmbeddings.length) {
        return null;
      }

      // Calculate weighted average embedding
      const totalInteractionStrength = weightedEmbeddings.reduce(
        (sum, item) => sum + item.interactionStrength,
        0
      );
      const dimensions = weightedEmbeddings[0].embedding.length;

      const averageEmbedding = new Array(dimensions).fill(0);
      for (const item of weightedEmbeddings) {
        for (let i = 0; i < dimensions; i++) {
          averageEmbedding[i] +=
            (item.embedding[i] * item.interactionStrength) /
            totalInteractionStrength;
        }
      }

      logger.debug(
        "Finished Determining Embeddings based on recent user interaction"
      );

      return averageEmbedding;
    } catch (error) {
      logger.error("Error calculating user interaction embedding:", error);
      return null;
    }
  }

  // Calculate cosine similarity between two embeddings
  private static calculateCosineSimilarity(
    embedding1: number[],
    embedding2: number[]
  ): number {
    try {
      const similarity =
        embedding1.reduce(
          (sum: number, val: number, i: number) => sum + val * embedding2[i],
          0
        ) /
        (Math.sqrt(
          embedding1.reduce((sum: number, val: number) => sum + val * val, 0)
        ) *
          Math.sqrt(
            embedding2.reduce((sum: number, val: number) => sum + val * val, 0)
          ));
      return similarity;
    } catch (error) {
      logger.error("Error calculating cosine similarity:", error);
      return 0;
    }
  }

  // Get recommended videos based on user interactions
  static async getRecommendedVideos(
    userId: string,
    limit: number = 20
  ): Promise<VideoMetadata[]> {
    try {
      logger.debug("Fetching recommended Videos");

      // Calculate user's interaction-based embedding
      let userInteractionEmbedding =
        await this.calculateUserInteractionEmbedding(userId);

      // If no interaction embedding, fall back to user's profile embedding or recent videos
      if (!userInteractionEmbedding) {
        logger.info(
          "No interaction embedding found, falling back to profile embedding"
        );
        const userData = await db
          .select({ embedding: users.embedding })
          .from(users)
          .where(eq(users.id, userId))
          .limit(1);

        if (!userData[0]?.embedding) {
          logger.info("No profile embedding found, returning recent videos");
          return db
            .select()
            .from(videos)
            .orderBy(desc(videos.createdAt))
            .limit(limit);
        }
        userInteractionEmbedding = userData[0].embedding;
      }

      // Get all videos with embeddings (excluding user's watched videos)
      const watchedVideoIds = (
        await db
          .select({ videoId: videoInteractions.videoId })
          .from(videoInteractions)
          .where(eq(videoInteractions.userId, userId))
      )
        .map((v) => v.videoId)
        .filter((id) => id != null);

      const videosData = await db
        .select()
        .from(videos)
        .where(
          and(
            isNotNull(videos.embedding),
            watchedVideoIds.length > 0
              ? not(inArray(videos.id, watchedVideoIds))
              : undefined
          )
        );

      // Calculate similarities and sort videos
      const scoredVideos = videosData
        .filter((video) => video.embedding)
        .map((video) => ({
          ...video,
          similarity: this.calculateCosineSimilarity(
            userInteractionEmbedding!,
            video.embedding!
          ),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      // Get user info for recommended videos
      const userIds = [...new Set(scoredVideos.map((video) => video.userId))];
      const usersData = await db
        .select({
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
        })
        .from(users)
        .where(inArray(users.id, userIds));

      const userMap = new Map(usersData.map((user) => [user.id, user]));

      logger.debug("Returning recommended Videos");

      // Format response
      return scoredVideos.map((video) => {
        const user = userMap.get(video.userId);
        return {
          id: video.id,
          videoUrl: video.videoUrl,
          caption: video.caption,
          userId: video.userId,
          videoLength: video.videoLength || undefined,
          videoSize: video.videoSize || undefined,
          transcription: video.transcription || undefined,
          summary: video.summary || undefined,
          tags: video.tags || undefined,
          metadata: video.metadata,
          embedding: video.embedding,
          userName: user?.username,
          userAvatar: user?.avatarUrl,
        };
      });
    } catch (error) {
      logger.error("Error getting recommended videos:", error);
      throw error;
    }
  }
}

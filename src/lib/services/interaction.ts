import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  comments,
  videoAnalytics,
  videoInteractions,
  VideoInteractionSelect,
} from "@/db/schema";

interface InteractionResponse {
  success: boolean;
  message: string;
  data?: VideoInteractionSelect[];
}

export class VideoInteractionService {
  // View video
  static async recordView(
    userId: string,
    videoId: string
  ): Promise<InteractionResponse> {
    try {
      const [existingView] = await db
        .select()
        .from(videoInteractions)
        .where(
          and(
            eq(videoInteractions.userId, userId),
            eq(videoInteractions.videoId, videoId),
            eq(videoInteractions.interactionType, "view")
          )
        );

      if (existingView) {
        return { success: true, message: "View already recorded" };
      }

      // Record the view interaction
      await db.insert(videoInteractions).values({
        userId,
        videoId,
        interactionType: "view",
        viewDuration: 0, // TODO Implement Watch Time
        watchPercentage: 0, // TODO Implement Watch Time
        interactionStrength: 1,
      });

      // Update analytics
      await db.transaction(async (tx) => {
        const [analytics] = await tx
          .select()
          .from(videoAnalytics)
          .where(eq(videoAnalytics.videoId, videoId));

        if (analytics) {
          await tx
            .update(videoAnalytics)
            .set({
              totalViews: Number(analytics.totalViews) + 1,
              updatedAt: new Date(),
            })
            .where(eq(videoAnalytics.videoId, videoId));
        } else {
          await tx.insert(videoAnalytics).values({
            videoId,
            totalViews: 1,
            totalLikes: 0,
            totalComments: 0,
            totalShares: 0,
          });
        }
      });

      return { success: true, message: "View recorded successfully" };
    } catch (error) {
      console.error("Error recording view:", error);
      return { success: false, message: "Failed to record view" };
    }
  }

  // Like/Unlike video
  static async toggleLike(
    userId: string,
    videoId: string
  ): Promise<InteractionResponse> {
    try {
      const [existingLike] = await db
        .select()
        .from(videoInteractions)
        .where(
          and(
            eq(videoInteractions.userId, userId),
            eq(videoInteractions.videoId, videoId),
            eq(videoInteractions.interactionType, "like")
          )
        );

      await db.transaction(async (tx) => {
        if (existingLike) {
          // Unlike
          await tx
            .delete(videoInteractions)
            .where(eq(videoInteractions.id, existingLike.id));

          await tx
            .update(videoAnalytics)
            .set({
              totalLikes: sql`${videoAnalytics.totalLikes} - 1`,
              updatedAt: new Date(),
            })
            .where(eq(videoAnalytics.videoId, videoId));

          return { success: true, message: "Video unliked successfully" };
        } else {
          // Like
          await tx.insert(videoInteractions).values({
            userId,
            videoId,
            interactionType: "like",
            interactionStrength: 1,
          });

          await tx
            .update(videoAnalytics)
            .set({
              totalLikes: sql`${videoAnalytics.totalLikes} + 1`,
              updatedAt: new Date(),
            })
            .where(eq(videoAnalytics.videoId, videoId));
        }
      });

      return {
        success: true,
        message: existingLike ? "Video unliked" : "Video liked",
      };
    } catch (error) {
      console.error("Error toggling like:", error);
      return { success: false, message: "Failed to toggle like" };
    }
  }

  // Share video
  static async recordShare(
    userId: string,
    videoId: string
  ): Promise<InteractionResponse> {
    try {
      await db.transaction(async (tx) => {
        // Record share interaction
        await tx.insert(videoInteractions).values({
          userId,
          videoId,
          interactionType: "share",
          interactionStrength: 2, // Share shows more interest in video than like
        });

        // Update analytics
        await tx
          .update(videoAnalytics)
          .set({
            totalShares: sql`${videoAnalytics.totalShares} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(videoAnalytics.videoId, videoId));
      });

      return { success: true, message: "Share recorded successfully" };
    } catch (error) {
      console.error("Error recording share:", error);
      return { success: false, message: "Failed to record share" };
    }
  }

  // Bookmark video
  static async toggleBookmark(
    userId: string,
    videoId: string
  ): Promise<InteractionResponse> {
    try {
      const [existingBookmark] = await db
        .select()
        .from(videoInteractions)
        .where(
          and(
            eq(videoInteractions.userId, userId),
            eq(videoInteractions.videoId, videoId),
            eq(videoInteractions.interactionType, "bookmark")
          )
        );

      if (existingBookmark) {
        await db
          .delete(videoInteractions)
          .where(eq(videoInteractions.id, existingBookmark.id));
        return { success: true, message: "Bookmark removed successfully" };
      }

      await db.insert(videoInteractions).values({
        userId,
        videoId,
        interactionType: "bookmark",
        interactionStrength: 3, // Shows much interest in video topics
      });

      return { success: true, message: "Video bookmarked successfully" };
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      return { success: false, message: "Failed to toggle bookmark" };
    }
  }

  // Add comment
  static async addComment(
    userId: string,
    videoId: string,
    content: string
  ): Promise<InteractionResponse> {
    try {
      await db.transaction(async (tx) => {
        // Add comment
        await tx.insert(comments).values({
          userId,
          videoId,
          content,
          totalLikes: 0,
        });

        // Record comment interaction
        await tx.insert(videoInteractions).values({
          userId,
          videoId,
          interactionType: "comment",
          interactionStrength: 3, // Comments show more interest than likes
        });

        // Update analytics
        await tx
          .update(videoAnalytics)
          .set({
            totalComments: sql`${videoAnalytics.totalComments} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(videoAnalytics.videoId, videoId));
      });

      return { success: true, message: "Comment added successfully" };
    } catch (error) {
      console.error("Error adding comment:", error);
      return { success: false, message: "Failed to add comment" };
    }
  }

  // Update view duration
  static async updateViewDuration(
    userId: string,
    videoId: string,
    duration: number,
    percentage: number
  ): Promise<InteractionResponse> {
    try {
      const [existingView] = await db
        .select()
        .from(videoInteractions)
        .where(
          and(
            eq(videoInteractions.userId, userId),
            eq(videoInteractions.videoId, videoId),
            eq(videoInteractions.interactionType, "view")
          )
        );

      if (!existingView) {
        return { success: false, message: "No view record found" };
      }

      await db
        .update(videoInteractions)
        .set({
          viewDuration: duration,
          watchPercentage: percentage,
          updatedAt: new Date(),
        })
        .where(eq(videoInteractions.id, existingView.id));

      return { success: true, message: "View duration updated successfully" };
    } catch (error) {
      console.error("Error updating view duration:", error);
      return { success: false, message: "Failed to update view duration" };
    }
  }

  // Get user's interaction history with a video
  static async getUserVideoInteractions(
    userId: string,
    videoId: string
  ): Promise<InteractionResponse> {
    try {
      const interactions = await db
        .select()
        .from(videoInteractions)
        .where(
          and(
            eq(videoInteractions.userId, userId),
            eq(videoInteractions.videoId, videoId)
          )
        );

      return {
        success: true,
        message: "Interactions retrieved successfully",
        data: interactions,
      };
    } catch (error) {
      console.error("Error retrieving interactions:", error);
      return { success: false, message: "Failed to retrieve interactions" };
    }
  }
}

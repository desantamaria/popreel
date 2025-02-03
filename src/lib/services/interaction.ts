import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { comments, videoAnalytics, videoInteractions } from "@/db/schema";
import { Logger } from "@/utils/logger";

const logger = new Logger("VideoInteractionService");

export class VideoInteractionService {
  // View video
  static async recordView(userId: string, videoId: string) {
    try {
      await db.insert(videoInteractions).values({
        userId,
        videoId,
        interactionType: "view",
        viewDuration: 0,
        watchPercentage: 0,
        interactionStrength: 1,
      });

      // Get existing analytics
      const [analytics] = await db
        .select()
        .from(videoAnalytics)
        .where(eq(videoAnalytics.videoId, videoId));

      if (analytics) {
        await db
          .update(videoAnalytics)
          .set({
            totalViews: Number(analytics.totalViews) + 1,
            updatedAt: new Date(),
          })
          .where(eq(videoAnalytics.videoId, videoId));
      } else {
        await db.insert(videoAnalytics).values({
          videoId,
          totalViews: 1,
          totalLikes: 0,
          totalComments: 0,
          totalShares: 0,
        });
      }

      return { success: true, message: "View recorded successfully" };
    } catch (error) {
      logger.error("Error recording view:", error);
      return { success: false, message: "Failed to record view" };
    }
  }

  // Like/Unlike video
  static async toggleLike(userId: string, videoId: string): Promise<boolean> {
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

      if (existingLike) {
        // Unlike
        await db
          .delete(videoInteractions)
          .where(eq(videoInteractions.id, existingLike.id));

        await db
          .update(videoAnalytics)
          .set({
            totalLikes: sql`${videoAnalytics.totalLikes} - 1`,
            updatedAt: new Date(),
          })
          .where(eq(videoAnalytics.videoId, videoId));

        return true;
      }

      // Like
      await db.insert(videoInteractions).values({
        userId,
        videoId,
        interactionType: "like",
        interactionStrength: 3,
      });

      await db
        .update(videoAnalytics)
        .set({
          totalLikes: sql`${videoAnalytics.totalLikes} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(videoAnalytics.videoId, videoId));

      const analyticsResults = await db
        .select({ likeCount: videoAnalytics.totalLikes })
        .from(videoAnalytics)
        .where(eq(videoAnalytics.videoId, videoId))
        .limit(1);

      return false;
    } catch (error) {
      logger.error("Error toggling like:", error);
      throw new Error("Failed to toggle like");
    }
  }

  // Share video
  static async recordShare(userId: string, videoId: string) {
    try {
      // Record share interaction
      await db.insert(videoInteractions).values({
        userId,
        videoId,
        interactionType: "share",
        interactionStrength: 4,
      });

      // Update analytics
      await db
        .update(videoAnalytics)
        .set({
          totalShares: sql`${videoAnalytics.totalShares} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(videoAnalytics.videoId, videoId));

      return { success: true, message: "Share recorded successfully" };
    } catch (error) {
      logger.error("Error recording share:", error);
      return { success: false, message: "Failed to record share" };
    }
  }

  // Bookmark video
  static async toggleBookmark(
    userId: string,
    videoId: string
  ): Promise<boolean> {
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
        return true;
      }

      await db.insert(videoInteractions).values({
        userId,
        videoId,
        interactionType: "bookmark",
        interactionStrength: 2,
      });

      return false;
    } catch (error) {
      logger.error("Error toggling bookmark:", error);
      throw new Error("Failed to toggle bookmark");
    }
  }

  // Add comment
  static async addComment(userId: string, videoId: string, content: string) {
    try {
      // Add comment
      await db.insert(comments).values({
        userId,
        videoId,
        content,
        totalLikes: 0,
      });

      // Record comment interaction
      await db.insert(videoInteractions).values({
        userId,
        videoId,
        interactionType: "comment",
        interactionStrength: 5,
      });

      // Update analytics
      await db
        .update(videoAnalytics)
        .set({
          totalComments: sql`${videoAnalytics.totalComments} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(videoAnalytics.videoId, videoId));

      return { success: true, message: "Comment added successfully" };
    } catch (error) {
      logger.error("Error adding comment:", error);
      return { success: false, message: "Failed to add comment" };
    }
  }

  // Update view duration
  static async updateViewDuration(
    userId: string,
    videoId: string,
    duration: number,
    percentage: number
  ) {
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
      logger.error("Error updating view duration:", error);
      return { success: false, message: "Failed to update view duration" };
    }
  }

  // Get user's interaction history with a video
  static async getUserVideoInteractions(userId: string, videoId: string) {
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
      logger.error("Error retrieving interactions:", error);
      return { success: false, message: "Failed to retrieve interactions" };
    }
  }
}

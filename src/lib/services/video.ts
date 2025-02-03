import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { Logger } from "@/utils/logger";
import { del } from "@vercel/blob";
import { and, desc, eq, inArray, isNotNull } from "drizzle-orm";

const logger = new Logger("VideoService");

export interface VideoMetadata {
  id: string;
  userId: string;
  caption: string | null;
  videoUrl: string;
  videoLength: string | undefined | null;
  videoSize: number | undefined | null;
  transcription: string | undefined | null;
  summary: string | undefined | null;
  tags: string[] | undefined | null;
  metadata: Record<string, unknown> | null;
  embedding: number[] | null;
  userName?: string | null | undefined;
  userAvatar?: string | null | undefined;
}

export class VideoService {
  static async createVideo(
    metadata: Omit<VideoMetadata, "id" | "createdAt">
  ): Promise<VideoMetadata> {
    try {
      logger.info("Creating video metadata", { url: metadata.videoUrl });

      await db.insert(videos).values({
        videoUrl: metadata.videoUrl,
        caption: metadata.caption,
        userId: metadata.userId,
        videoSize: metadata.videoSize,
        transcription: metadata.transcription,
        tags: metadata.tags,
        videoLength: metadata.videoLength,
        summary: metadata.summary,
        metadata: metadata.metadata,
        embedding: metadata.embedding,
      });

      const videoData = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.videoUrl, metadata.videoUrl),
            eq(videos.userId, metadata.userId)
          )
        )
        .orderBy(desc(videos.createdAt))
        .limit(1);

      const video = videoData[0];
      return {
        id: video.id,
        userId: video.userId,
        caption: video.caption,
        videoUrl: video.videoUrl,
        videoLength: video.videoLength || undefined,
        videoSize: video.videoSize || undefined,
        transcription: video.transcription || undefined,
        summary: video.summary || undefined,
        tags: video.tags || undefined,
        metadata: video.metadata,
        embedding: video.embedding,
      };
    } catch (error) {
      logger.error("Failed to create video metadata", { error });
      throw error;
    }
  }

  static async listUserVideos(userId: string): Promise<VideoMetadata[]> {
    try {
      const data = await db
        .select()
        .from(videos)
        .where(eq(videos.userId, userId))
        .orderBy(desc(videos.createdAt));

      return data.map((video) => ({
        id: video.id,
        videoUrl: video.videoUrl,
        caption: video.caption,
        userId: video.userId,
        videoSize: video.videoSize,
        transcription: video.transcription,
        tags: video.tags,
        videoLength: video.videoLength,
        summary: video.summary,
        metadata: video.metadata,
        embedding: video.embedding,
      }));
    } catch (error) {
      logger.error("Failed to list all user videos", { error });
      throw error;
    }
  }

  static async listAllVideos(): Promise<VideoMetadata[]> {
    try {
      logger.debug("Listing all videos");

      const videosData = await db
        .select()
        .from(videos)
        .orderBy(desc(videos.createdAt));

      if (!videosData) {
        throw new Error("Failed to fetch videos from database");
      }

      // Get unique user IDs from videos
      const userIds = Array.from(
        new Set(
          videosData.map((video) => video.userId).filter((id) => id !== null)
        )
      );

      // Fetch user info for all users in one query
      const usersData = await db
        .select({
          id: users.id,
          username: users.username,
          avatarUrl: users.avatarUrl,
        })
        .from(users)
        .where(inArray(users.id, userIds));

      if (!usersData) {
        throw new Error("Failed to fetch users from database");
      }

      // Create a map of user info for quick lookup
      const userMap = new Map(usersData.map((user) => [user.id, user]));

      return videosData.map((video) => {
        const user = userMap.get(video.userId);
        return {
          id: video.id,
          videoUrl: video.videoUrl,
          caption: video.caption,
          userId: video.userId,
          createdAt: video.createdAt,
          transcription: video.transcription || undefined,
          tags: video.tags || undefined,
          videoLength: video.videoLength || undefined,
          videoSize: video.videoSize || undefined,
          summary: video.summary || undefined,
          metadata: video.metadata || null,
          embedding: video.embedding || null,
          userName: user?.username,
          userAvatar: user?.avatarUrl,
        };
      });
    } catch (error) {
      logger.error("Failed to list all videos", { error });
      throw error;
    }
  }

  static async getVideo(id: string): Promise<VideoMetadata | null> {
    try {
      logger.info("Fetching video metadata", { id });

      const videoData = await db
        .select()
        .from(videos)
        .where(eq(videos.id, id))
        .limit(1);
      return videoData[0];
    } catch (error) {
      logger.error("Failed to fetch video", { error });
      throw error;
    }
  }

  static async deleteVideo(id: string) {
    logger.info("Deleting video", id);

    const videoData = await db
      .select()
      .from(videos)
      .where(eq(videos.id, id))
      .limit(1);

    logger.info("Deleting video from Vercel Blob");
    await del(videoData[0].videoUrl);

    await db.delete(videos).where(eq(videos.id, id));

    logger.info("Deleted video successfully", id);
  }

  static async updateVideo(id: string, data: Partial<VideoMetadata>) {
    logger.info("Updating video", id);
    const { transcription, summary, tags, embedding } = data;
    await db
      .update(videos)
      .set({ transcription, summary, tags, embedding })
      .where(and(eq(videos.id, id)));

    logger.info("Updated video successfully", id);
  }
}

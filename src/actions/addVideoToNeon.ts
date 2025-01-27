"use server";

import { createVideo } from "@/db/operations";
import { CreateVideoInput, VideoMetadata } from "@/db/schema";
import { isAuthenticated } from "@/helpers/isAuthenticated";
import { CreateEmbeddingResponse } from "openai/resources";

export async function AddVideoToNeon(
  url: string,
  metadata: VideoMetadata,
  embedding: CreateEmbeddingResponse
) {
  const userId = await isAuthenticated();
  const newVideo = {
    videoUrl: url,
    userId: userId,
    metadata: metadata,
    embedding: embedding,
    viewsCount: 0,
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    bookmarksCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as CreateVideoInput;

  createVideo(newVideo);
}

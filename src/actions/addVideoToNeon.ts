"use server";

import { createVideo } from "@/db/operations";
import { CreateVideoInput } from "@/db/schema";
import { isAuthenticated } from "@/helpers/isAuthenticated";

export async function AddVideoToNeon(
  url: string,
  metadata: JSON,
  embedding: number[]
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

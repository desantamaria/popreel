"use server";

import { env } from "@/config/env";
import { db } from "@/db";
import { users } from "@/db/schema";
import { Logger } from "@/utils/logger";
import { auth } from "@clerk/nextjs/dist/types/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";

const logger = new Logger("actions:user");

export async function updateUserInterests(interests: string[]) {
  logger.info("Updating user interests", { interestCount: interests.length });

  const { userId } = await auth();
  if (!userId) {
    logger.error("Authentication failed - no userIf found");
    throw new Error("Not Authenticated");
  }

  try {
    logger.debug("Calculating interest embedding");

    // Convert interests array to meaningful text for embedding
    const interestText = `User is interested in: ${interests.join(", ")}`;

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    // Generate embedding
    logger.debug("Generating embedding from interests", { interestText });
    const result = await model.embedContent(interestText);
    const userEmbedding = result.embedding.values;

    logger.debug("Embedding generated successfully", {
      embeddingLength: userEmbedding.length,
    });

    // Update user metadata and embedding
    await db
      .update(users)
      .set({ metadata: { interests } })
      .where(eq(users.id, userId));
  } catch (error) {
    logger.error("Failed to update user interests", { error, userId });
    throw error;
  }
}

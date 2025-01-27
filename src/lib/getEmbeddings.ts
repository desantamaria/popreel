import { Logger } from "@/utils/logger";
import { OpenAI } from "openai";

const logger = new Logger("GetEmbeddings");
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getOpenAIEmbeddings(input: string): Promise<number[]> {
  logger.info("Getting OpenAI embeddings", {
    responseLength: input.length,
  });
  try {
    const startTime = Date.now();
    const embeddings = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: [input],
    });

    const duration = Date.now() - startTime;

    logger.info("OpenAI embeddings retrieved successfully", {
      duration,
      embeddingLength: embeddings.data.length,
    });

    return embeddings.data[0].embedding;
  } catch (error) {
    logger.error("Failed to get OpenAI embeddings", { error });
    throw error;
  }
}

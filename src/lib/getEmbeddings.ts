import { Logger } from "@/utils/logger";
import { OpenAI } from "openai";
import { CreateEmbeddingResponse } from "openai/resources/embeddings";

const logger = new Logger("GetEmbeddings");
const openai = new OpenAI();

export async function getOpenAIEmbeddings(
  input: string
): Promise<CreateEmbeddingResponse> {
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

    return embeddings;
  } catch (error) {
    logger.error("Failed to get OpenAI embeddings", { error });
    throw error;
  }
}

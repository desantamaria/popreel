import { Logger } from "@/utils/logger";
import { OpenAI } from "openai";
import useSWR from "swr";

const logger = new Logger("GetEmbeddings");

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function getOpenAIEmbeddings(input: string): Promise<number[]> {
  try {
    const response = await fetch(`${baseUrl}/api/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: input,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error with status: ${response.status}`);
    }

    const data = await response.json();

    return data.result;
  } catch (error) {
    logger.error("Failed to get OpenAI embeddings", { error });
    throw error;
  }
}

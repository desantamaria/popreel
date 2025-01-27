import { Logger } from "@/utils/logger";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const logger = new Logger("OpenAI Embeddings");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request): Promise<NextResponse> {
  const { input } = await request.json();

  try {
    const embeddings = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: [input],
    });

    return NextResponse.json({ result: embeddings.data[0].embedding });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

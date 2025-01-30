"use server";

import { env } from "@/config/env";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { VideoMetadata, VideoService } from "@/lib/services/video";
import { Logger } from "@/utils/logger";
import { auth } from "@clerk/nextjs/dist/types/server";
import { Part, VertexAI } from "@google-cloud/vertexai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { del, put } from "@vercel/blob";
import { and, eq } from "drizzle-orm";
import { writeFile } from "fs/promises";
import Groq from "groq-sdk";
import { revalidatePath } from "next/cache";
import { tmpdir } from "os";
import { join } from "path";

const logger = new Logger("actions:video");

export async function getVideos(userId?: string): Promise<VideoMetadata[]> {
  if (userId) {
    return VideoService.getRecommendedVideos(userId);
  }
  return VideoService.listAllVideos();
}

export async function deleteVideo(videoUrl: string) {
  const session = await auth();
  if (!session.userId) throw new Error("Unauthorized");

  try {
    logger.info("Starting video deletion", { url: videoUrl });

    // Get video metadata
    const videos = await VideoService.listUserVideos(session.userId);
    const video = videos.find((v) => v.videoUrl === videoUrl);

    if (!video) throw new Error("Video not found");
    if (video.userId !== session.userId) throw new Error("Unauthorized");

    // Delete from Vercel Blob
    await del(videoUrl);

    // Delete from Neon
    await VideoService.deleteVideo(video.id);

    logger.info("Video deletion completed", { videoId: video.id });
    revalidatePath("/feed");
  } catch (error) {
    logger.error("Failed to delete video", { error });
    throw error;
  }
}

export async function createVideo(formData: FormData) {
  const session = await auth();
  const userId = session?.userId;
  if (!userId) throw new Error("Unauthorized");

  const file = formData.get("video") as File;
  const caption = formData.get("caption") as string;

  if (!file || !caption) {
    throw new Error("Missing required fields");
  }

  // Verify file is video
  if (!file.type.startsWith("video/")) {
    throw new Error("File must be a video");
  }

  // Create a filename that includes metadata
  const metadataFilename = `${userId}_User_${encodeURIComponent(caption)}_${
    file.name
  }`;

  try {
    logger.info("Starting video creation", { filename: metadataFilename });

    // Save file tin temp directory in get duration
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = join(tmpdir(), file.name);
    await writeFile(tempPath, buffer);

    // TODO Get video duration
    // const duration = await getVideoDuration(tempPath);

    // Upload to Vercel Blob
    const blob = await put(metadataFilename, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // Create video metadata in Neon first
    const video = await VideoService.createVideo({
      videoUrl: blob.url,
      caption,
      userId,
      videoSize: file.size,
      videoLength: undefined,
      transcription: undefined,
      summary: undefined,
      tags: [],
      metadata: {
        originalName: file.name,
        type: file.type,
        lastModified: file.lastModified,
      },
      embedding: null,
    });

    // Start transcription and analysis in parallel
    const [transcription, summary] = await Promise.all([
      transcribeVideo(video.id).catch((error) => {
        logger.error("Failed to transcribe video", { error });
        return null;
      }),
      analyzeVideo(video.id).catch((error) => {
        logger.error("Failed to analyze video", { error });
      }),
    ]);

    let tags: string[] | undefined;
    let embedding: number[] | undefined;

    if (summary) {
      // Extract tags and create embedding in parallel
      [tags, embedding] = await Promise.all([
        extractTags(summary),
        createVideoEmbedding(summary),
      ]);
    }

    // Update video with transcriptions, summary and tags
    await VideoService.updateVideo(video.id, {
      transcription: transcription || undefined,
      summary: summary || undefined,
      tags: tags || undefined,
      embeddings: embedding || undefined,
    });

    logger.info("Video creation completed", { videoId: video.id });

    revalidatePath("/feed");

    return video;
  } catch (error) {
    logger.error("Failed to create video", { error });
  }
}

export async function transcribeVideo(videoId: string): Promise<string> {
  const session = await auth();
  if (!session?.userId) throw new Error("Unauthorized");

  try {
    logger.info("Starting video transcription", { videoId });

    // Get video metadata
    const video = await VideoService.getVideo(videoId);
    if (!video) throw new Error("Video not found");
    if (video.userId !== session.userId) throw new Error("Unauthorized");

    logger.info("Video URL", { videoUrl: video.videoUrl });

    // Download video file
    const response = await fetch(video.videoUrl);
    const blob = await response.blob();
    const file = new File([blob], "video.mp4", { type: "video/mp4" });

    // Initialize the Groq client
    const groq = new Groq({ apiKey: env.GROQ_API_KEY });

    // Call Groq API for transcription
    const transcriptionResponse = await groq.audio.transcriptions.create({
      model: "distil-whisper-large-v3-en",
      file,
      response_format: "text",
    });

    // Convert transcription response to string
    const transcription = String(transcriptionResponse);

    logger.info("Transcription recieved", { transcriptionResponse });

    // Get authenticated client for update
    await db
      .update(videos)
      .set({ transcription })
      .where(and(eq(videos.id, videoId), eq(videos.userId, session.userId)));

    logger.info("Video transcription completed", { videoId });

    revalidatePath("/feed");
    return transcription;
  } catch (error) {
    logger.error("Failed to transcribe video", { error });
    throw error;
  }
}

export async function analyzeVideo(videoId: string) {
  const session = await auth();
  if (!session?.userId) throw new Error("Unauthorized");

  try {
    logger.info("Starting video analysis with Vertex AI", { videoId });

    // Get video metadata
    const video = await VideoService.getVideo(videoId);
    if (!video) throw new Error("Video not found");
    if (video.userId !== session.userId) throw new Error("Unauthorized");

    // Initialize Vertex AI
    const vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID,
      location: "use-east1",
    });

    const generativeModel = vertexAI.getGenerativeModel({
      model: "gemini-1.5-flash-001",
    });

    const filePart: Part = {
      fileData: {
        fileUri: video.videoUrl,
        mimeType: "video/mp4",
      },
    };

    const textPart: Part = {
      text: `Provide a comprehensive analysis of this video.`,
    };

    const request = {
      contents: [
        {
          role: "user",
          parts: [filePart, textPart],
        },
      ],
    };

    const resp = await generativeModel.generateContent(request);
    const contentResponse = await resp.response;

    if (!contentResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Failed to generate video analysis");
    }

    const summary = contentResponse.candidates[0].content.parts[0].text;

    // Store the analysis in Neon
    await db
      .update(videos)
      .set({ summary })
      .where(and(eq(videos.id, videoId), eq(videos.userId, session.userId)));

    logger.info("Video analysis completed", { videoId });

    revalidatePath("/feed");

    return summary;
  } catch (error) {
    logger.error("Failed to analyze video", { error });
    throw error;
  }
}

export async function extractTags(summary: string): Promise<string[]> {
  const groq = new Groq({ apiKey: env.GROQ_API_KEY });
  const response = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `Analyze this video summary and extract relevant content tags.
          
          Summary to analyze:
          <summary>
          ${summary}
          </summary>

          Return format:
          {
            "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
          }`,
      },
    ],
    model: "llama-3-70b-8192",
    response_format: { type: "json_object" },
  });

  logger.info("Tags extracted", { tags: response.choices[0].message.content });

  try {
    const tags = JSON.parse(response.choices[0].message.content || "{}");
    return tags.tags || [];
  } catch (error) {
    logger.error("Failed to parse tags", { error });
    throw error;
  }
}

async function createVideoEmbedding(summary: string) {
  // Initialize Google Generative AI
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

  // Generate embedding
  logger.debug("Generating embedding from interests", { summary });
  const result = await model.embedContent(summary);
  const summaryEmbedding = result.embedding.values;

  logger.debug("Embedding generated successfully", {
    embeddingLength: summaryEmbedding.length,
  });
  return summaryEmbedding;
}

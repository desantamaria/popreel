import { isAuthenticated } from "@/helpers/isAuthenticated";
import { Logger } from "@/utils/logger";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const logger = new Logger("Video Upload");

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const userId = await isAuthenticated();
        if (!userId) {
          throw new Error("User not authenticated");
        }

        return {
          allowedContentTypes: [
            "video/mp4",
            "video/quicktime",
            "video/x-msvideo",
            "video/mpeg",
          ],
          tokenPayload: JSON.stringify({
            userId,
            uploadPath: pathname,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        logger.info("blob upload completed", { blob, tokenPayload });
        try {
          if (tokenPayload) {
            const { userId, uploadPath } = JSON.parse(tokenPayload);
          }
        } catch (error) {
          throw new Error("Could not update user");
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The webhook will retry 5 times waiting for a 200
    );
  }
}

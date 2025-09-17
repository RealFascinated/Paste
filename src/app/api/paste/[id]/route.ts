import { getPaste } from "@/common/prisma";
import Logger from "@/common/logger";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const startTime = performance.now();
  const pasteId = (await params).id;

  Logger.info("Paste retrieval request", {
    pasteId,
    userAgent: request.headers.get("user-agent"),
    ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
  });

  try {
    const foundPaste = await getPaste(pasteId, false);
    if (foundPaste == null) {
      Logger.warn("Paste not found", {
        pasteId,
        duration: performance.now() - startTime
      });
      return Response.json(
        {
          message: "Paste not found",
        },
        {
          status: 404,
        }
      );
    }

    const { id, ...paste } = foundPaste;
    
    Logger.infoWithTiming("Paste retrieved successfully", startTime, {
      pasteId: id,
      size: paste.size,
      ext: paste.ext,
      language: paste.language,
      deleteAfterRead: paste.deleteAfterRead,
      expiresAt: paste.expiresAt?.toISOString()
    });

    return Response.json({
      key: id,
      ext: paste.ext,
      language: paste.language,
      expiresAt: paste.expiresAt,
      content: paste.content,
      size: paste.size,
      timestamp: paste.timestamp,
    });
  } catch (error) {
    Logger.errorWithTiming("Failed to retrieve paste", startTime, {
      pasteId,
      error: error instanceof Error ? error.message : String(error)
    });

    return Response.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}

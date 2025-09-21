import { Config } from "@/common/config";
import { buildErrorResponse } from "@/common/error";
import Logger from "@/common/logger";
import { createPaste } from "@/common/prisma";
import { Ratelimiter, RateLimitResponse } from "@/common/ratelimiter";
import { getIP } from "@/common/utils";
import { formatBytes } from "@/common/utils/string.util";
import { spamFilters } from "@/filter/filters";
import { NextRequest } from "next/server";

/**
 * Configure the rate limit for this route.
 */
Ratelimiter.configRoute("/api/upload", {
  windowMs: 1000 * 60,
  maxRequests: 15, // 15 requests per minute
});

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  // Handle rate limiting
  const rateLimitResponse: RateLimitResponse | undefined = Ratelimiter.check(
    req,
    `/api/upload`
  );
  if (rateLimitResponse) {
    if (!rateLimitResponse.allowed) {
      Logger.warn(`Rate limit exceeded for upload: ${getIP(req)}`, {
        remaining: rateLimitResponse.remainingRequests,
        resetTime: rateLimitResponse.resetTime,
      });
      return Ratelimiter.applyHeaders(
        buildErrorResponse("You have been rate limited!", 429),
        rateLimitResponse
      );
    }
  }

  const body = await req.text();

  // Validate the request body
  if (body == undefined || body == "") {
    Logger.warn("Invalid request body - empty", {
      duration: performance.now() - startTime,
    });
    return new Response("Invalid request body", {
      status: 400,
    });
  }

  // Ensure the body is not too large
  const bodySize = Buffer.byteLength(body);
  if (bodySize / 1024 > Config.maxPasteSize) {
    Logger.warn("Paste size exceeded", {
      sizeKB: Math.round(bodySize / 1024),
      maxSizeKB: Config.maxPasteSize,
      duration: performance.now() - startTime,
    });
    return buildErrorResponse("Your paste exceeds the maximum size", 400);
  }

  Logger.debug("Request body validated", {
    sizeKB: Math.round(bodySize / 1024),
    duration: performance.now() - startTime,
  });

  for (const filter of spamFilters) {
    if (filter.checkFilter(body)) {
      Logger.warn("Paste filtered by spam filter", {
        filterName: filter.getName(),
        sizeKB: Math.round(bodySize / 1024),
        duration: performance.now() - startTime,
      });
      return buildErrorResponse(
        "Your paste has been filtered by our spam filter",
        400
      );
    }
  }

  // Parse the expiry date
  const expiresAtRaw = req.nextUrl.searchParams.get("expires");
  const expiresAt = expiresAtRaw
    ? new Date(new Date().getTime() + Number(expiresAtRaw) * 1000)
    : undefined;

  // Check if the expiry date is in the past
  if (expiresAt && expiresAt.getTime() < new Date().getTime()) {
    Logger.warn("Invalid expiry date - in the past", {
      expiresAt: expiresAt.toISOString(),
      duration: performance.now() - startTime,
    });
    return buildErrorResponse("Expiry date is in the past", 400);
  }

  // Check if the expiry date is within the max expiry length
  if (
    expiresAt &&
    expiresAt.getTime() + Config.maxExpiryLength * 1000 < new Date().getTime()
  ) {
    Logger.warn("Invalid expiry date - too far in future", {
      expiresAt: expiresAt.toISOString(),
      maxExpiryLength: Config.maxExpiryLength,
      duration: performance.now() - startTime,
    });
    return buildErrorResponse("Expiry date is too far in the future", 400);
  }

  try {
    const { id, ...paste } = await createPaste(body, expiresAt);

    Logger.infoWithTiming(
      `Paste created: ${id}, ${formatBytes(paste.size)}`,
      startTime,
      {
        pasteId: id,
        size: paste.size,
        language: paste.language,
        expiresAt: paste.expiresAt?.toISOString(),
      }
    );

    return Response.json({
      key: `${id}.${paste.ext}`,
      ext: paste.ext,
      expiresAt: paste.expiresAt,
    });
  } catch (error) {
    Logger.errorWithTiming("Failed to create paste", startTime, {
      error: error instanceof Error ? error.message : String(error),
      sizeKB: Math.round(bodySize / 1024),
    });
    return buildErrorResponse("Failed to create paste", 500);
  }
}

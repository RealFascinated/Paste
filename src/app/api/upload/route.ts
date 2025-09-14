import { Config } from "@/common/config";
import { buildErrorResponse } from "@/common/error";
import Logger from "@/common/logger";
import { createPaste } from "@/common/prisma";
import { Ratelimiter, RateLimitResponse } from "@/common/ratelimiter";
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
  // Handle rate limiting
  const rateLimitResponse: RateLimitResponse | undefined = Ratelimiter.check(
    req,
    `/api/upload`
  );
  if (rateLimitResponse) {
    if (!rateLimitResponse.allowed) {
      return Ratelimiter.applyHeaders(
        buildErrorResponse("You have been rate limited!", 429),
        rateLimitResponse
      );
    }
  }

  const body = await req.text();

  // Validate the request body
  if (body == undefined || body == "") {
    return new Response("Invalid request body", {
      status: 400,
    });
  }

  // Ensure the body is not too large
  const bodySize = Buffer.byteLength(body);
  if (bodySize / 1024 > Config.maxPasteSize) {
    return buildErrorResponse("Your paste exceeds the maximum size", 400);
  }

  for (const filter of spamFilters) {
    if (filter.checkFilter(body)) {
      Logger.info(
        `Paste upload has been filtered by our spam filter: ${filter.getName()}`
      );
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

  // Parse the delete after read flag
  const deleteAfterReadRaw = req.nextUrl.searchParams.get("deleteAfterRead");
  const deleteAfterRead = deleteAfterReadRaw === "true";

  // Check if the expiry date is in the past
  if (expiresAt && expiresAt.getTime() < new Date().getTime()) {
    return buildErrorResponse("Expiry date is in the past", 400);
  }

  // Check if the expiry date is within the max expiry length
  if (
    expiresAt &&
    expiresAt.getTime() + Config.maxExpiryLength * 1000 < new Date().getTime()
  ) {
    return buildErrorResponse("Expiry date is too far in the future", 400);
  }
  const { id, ...paste } = await createPaste(body, expiresAt, deleteAfterRead);

  Logger.info(`Paste created: ${id}, ${formatBytes(paste.size)}`);
  return Response.json({
    key: id,
    ext: paste.ext,
    expiresAt: paste.expiresAt,
  });
}

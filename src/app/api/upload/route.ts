import { NextRequest } from "next/server";
import { auth } from "@/common/auth";
import { Config } from "@/common/config";
import { createPaste } from "@/common/prisma";
import { Ratelimiter, RateLimitResponse } from "@/common/ratelimiter";
import { buildErrorResponse } from "@/common/error";

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
    `/api/upload`,
  );
  if (rateLimitResponse) {
    if (!rateLimitResponse.allowed) {
      return Ratelimiter.applyHeaders(
        buildErrorResponse("You have been rate limited!", 429),
        rateLimitResponse,
      );
    }
  }

  const session = await auth.api.getSession({ headers: req.headers });
  const body = await req.text();

  // Validate the request body
  if (body == undefined || body == "") {
    return new Response("Invalid request body", {
      status: 400,
    });
  }

  // Parse the expiry date
  const expiresAtRaw = req.nextUrl.searchParams.get("expires");
  const expiresAt = expiresAtRaw
    ? new Date(new Date().getTime() + Number(expiresAtRaw) * 1000)
    : undefined;

  // Check if the expiry date is in the past
  if (expiresAt && expiresAt.getTime() < new Date().getTime()) {
    return new Response("Expiry date is in the past", {
      status: 400,
    });
  }

  // Check if the expiry date is within the max expiry length
  if (
    expiresAt &&
    expiresAt.getTime() + Config.maxExpiryLength * 1000 < new Date().getTime()
  ) {
    return new Response("Max expiry date exceeded", {
      status: 400,
    });
  }

  const { id, ...paste } = await createPaste(body, expiresAt, session?.user);
  return Response.json({
    key: id,
    ext: paste.lang === "text" ? "txt" : paste.lang,
    expiresAt: paste.expiresAt,
  });
}

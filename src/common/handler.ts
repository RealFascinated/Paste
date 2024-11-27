import { NextRequest } from "next/server";
import { Config } from "@/common/config";
import { createPaste } from "@/common/prisma";

/**
 * Handles the upload request.
 *
 * @param req the request object.
 * @returns the response.
 */
export async function uploadHandler(req: NextRequest) {
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

  const paste = await createPaste(body, expiresAt);
  return Response.json({
    key: paste.id,
    ...paste,
  });
}

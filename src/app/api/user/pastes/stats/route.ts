import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/common/auth";
import { buildErrorResponse } from "@/common/error";
import { getUserPasteStatistics } from "@/common/prisma";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (session == null) {
    return buildErrorResponse("Invalid session", 401);
  }

  return NextResponse.json(await getUserPasteStatistics(session.user));
}

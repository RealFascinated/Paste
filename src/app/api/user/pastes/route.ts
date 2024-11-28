import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/common/auth";
import { buildErrorResponse } from "@/common/error";
import { getUsersPastes } from "@/common/prisma";
import { Pagination } from "@/common/pagination/pagination";
import { Paste } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (session == null) {
    return buildErrorResponse("Invalid session", 401);
  }

  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
  const pagination = new Pagination<Paste>()
    .setItemsPerPage(12)
    .setItems(await getUsersPastes(session.user));
  return NextResponse.json(await pagination.getPage(page));
}

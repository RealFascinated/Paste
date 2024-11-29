import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/common/auth";
import { buildErrorResponse } from "@/common/error";
import { getUsersPastes } from "@/common/prisma";
import { Pagination } from "@/common/pagination/pagination";
import SuperJSON from "superjson";
import { Paste } from "@/types/paste";
import { getPublicPaste } from "@/common/utils/paste.util";

const itemsPerPage = 16;

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (session == null) {
    return buildErrorResponse("Invalid session", 401);
  }

  const page = parseInt(req.nextUrl.searchParams.get("page") ?? "1");
  const { totalItems } = await getUsersPastes(session.user, {
    countOnly: true,
  });

  const pagination = new Pagination<Paste>()
    .setItemsPerPage(itemsPerPage)
    .setTotalItems(totalItems);
  return NextResponse.json(
    SuperJSON.serialize(
      (
        await pagination.getPage(page, async () => {
          const { pastes } = await getUsersPastes(session.user, {
            skip: page > 1 ? (page - 1) * itemsPerPage : 0,
            take: itemsPerPage,
          });
          return pastes.map((paste) => getPublicPaste(paste));
        })
      ).toJSON(),
    ),
  );
}

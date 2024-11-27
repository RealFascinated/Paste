import { NextRequest } from "next/server";
import { getPaste } from "@/common/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;

  const paste = await getPaste(id);
  if (paste == null) {
    return Response.json(
      {
        message: "Paste not found",
      },
      {
        status: 404,
      },
    );
  }

  return Response.json(paste);
}

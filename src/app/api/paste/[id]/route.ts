import { NextRequest } from "next/server";
import { getPaste } from "@/common/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const foundPaste = await getPaste((await params).id);
  if (foundPaste == null) {
    return Response.json(
      {
        message: "Paste not found",
      },
      {
        status: 404,
      },
    );
  }

  const { id, ...paste } = foundPaste;
  return Response.json({
    key: id,
    ...paste,
  });
}

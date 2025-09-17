import { getPaste } from "@/common/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const paste = await getPaste((await params).id, true);

  if (paste == null) {
    return new NextResponse("Paste not found", { status: 404 });
  }

  return new NextResponse(paste.content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

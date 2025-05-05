import { lookupPaste } from "@/common/utils/paste.util";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const paste = await lookupPaste((await params).id);
  
  if (paste == null) {
    return new NextResponse("Paste not found", { status: 404 });
  }

  return new NextResponse(paste.content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
} 
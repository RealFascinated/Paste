import { NextRequest } from "next/server";
import { uploadHandler } from "@/common/handler";

export async function POST(req: NextRequest) {
  return await uploadHandler(req);
}

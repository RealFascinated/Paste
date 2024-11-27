import { NextRequest } from "next/server";
import { uploadHandler } from "@/app/common/handler";

export async function POST(req: NextRequest) {
  return await uploadHandler(req);
}

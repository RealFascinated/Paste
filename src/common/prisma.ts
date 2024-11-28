import { PrismaClient } from "@prisma/client";
import { generatePasteId } from "@/common/utils/paste.util";
import { getLanguage } from "@/common/utils/lang.util";
import { User } from "better-auth";

export const prismaClient = new PrismaClient();

/**
 * Creates a new paste with a random ID.
 *
 * @param content The content of the paste.
 * @param expiresAt The expiration date of the paste.
 * @param uploader the user who uploaded the paste.
 * @returns The created paste.
 */
export async function createPaste(
  content: string,
  expiresAt?: Date,
  uploader?: User,
) {
  if (expiresAt && expiresAt.getTime() < new Date().getTime()) {
    expiresAt = undefined;
  }
  return prismaClient.paste.create({
    data: {
      id: await generatePasteId(),
      content: content,
      size: Buffer.byteLength(content),
      lang: await getLanguage(content),
      ...(uploader && { ownerId: uploader.id }),
      expiresAt: expiresAt,
      timestamp: new Date(),
    },
  });
}

/**
 * Gets a paste by ID.
 *
 * @param id The ID of the paste to get.
 * @returns The paste with the given ID.
 */
export function getPaste(id: string) {
  return prismaClient.paste.findUnique({
    where: {
      id: id,
    },
  });
}

/**
 * Expires all pastes that have expired.
 */
export async function expirePastes() {
  const { count } = await prismaClient.paste.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  console.log(`Expired ${count} pastes`);
}

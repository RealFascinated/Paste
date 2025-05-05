import { getLanguage, getLanguageName } from "@/common/utils/lang.util";
import { generatePasteId } from "@/common/utils/paste.util";
import { Paste, PrismaClient } from "@/generated/prisma";

let prismaClientInstance: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaClientInstance) {
    prismaClientInstance = new PrismaClient();
  }
  return prismaClientInstance;
}

/**
 * Creates a new paste with a random ID.
 *
 * @param content The content of the paste.
 * @param expiresAt The expiration date of the paste.
 * @param filename Optional filename to help with language detection
 * @returns The created paste.
 */
export async function createPaste(
  content: string,
  expiresAt?: Date,
  filename?: string
): Promise<Paste> {
  if (expiresAt && expiresAt.getTime() < new Date().getTime()) {
    expiresAt = undefined;
  }
  const ext = await getLanguage(content, filename);
  return getPrismaClient().paste.create({
    data: {
      id: await generatePasteId(),
      content: content,
      size: Buffer.byteLength(content),
      ext: ext,
      language: await getLanguageName(ext),
      expiresAt: expiresAt,
      timestamp: new Date(),
    },
  });
}

/**
 * Gets a paste by ID.
 *
 * @param id the ID of the paste to get.
 * @param incrementViews whether to increment the views of the paste.
 * @returns the paste with the given ID.
 */
export async function getPaste(
  id: string,
  incrementViews = false
): Promise<Paste | null> {
  try {
    if (incrementViews) {
      return await getPrismaClient().paste.update({
        where: {
          id: id,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });
    }
    return (await getPrismaClient().paste.findUnique({
      where: {
        id: id,
      },
    })) as Paste;
  } catch {
    return null;
  }
}

/**
 * Expires all pastes that have expired.
 */
export async function expirePastes() {
  const { count } = await getPrismaClient().paste.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  console.log(`Expired ${count} pastes`);
}

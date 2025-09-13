import { getLanguage, getLanguageName } from "@/common/utils/lang.util";
import { generatePasteId } from "@/common/utils/paste.util";
import { Paste, PrismaClient } from "@/generated/prisma";
import { PasteWithContent } from "@/types/paste";
import Logger from "./logger";
import S3Service from "./s3";
import { formatDuration } from "./utils/date.util";

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
): Promise<PasteWithContent> {
  if (expiresAt && expiresAt.getTime() < new Date().getTime()) {
    expiresAt = undefined;
  }

  const id = await generatePasteId();
  const ext = await getLanguage(content, filename);
  try {
    await S3Service.saveFile(`${id}.${ext}`, Buffer.from(content)); // Save the paste to S3

    // Create the paste in the database
    return {
      ...(await getPrismaClient().paste.create({
        data: {
          id: id,
          size: Buffer.byteLength(content),
          expiresAt: expiresAt,
          language: await getLanguageName(ext),
          ext: ext,
          timestamp: new Date(),
        },
      })),
      key: id,
      content: content,
    } as PasteWithContent;
  } catch {
    throw new Error("Failed to save paste to S3");
  }
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
): Promise<PasteWithContent | null> {
  const before = performance.now();

  let paste: Paste | null;

  if (incrementViews) {
    // Use update with increment to both update and return data in one call
    paste = await getPrismaClient().paste.update({
      where: {
        id: id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } else {
    // Use findUnique for read-only access
    paste = await getPrismaClient().paste.findUnique({
      where: {
        id: id,
      },
    });
  }

  if (!paste) {
    return null;
  }

  const content =
    (await S3Service.getFile(`${paste.id}.${paste.ext}`))?.toString("utf-8") ??
    "";
  Logger.info(
    `Got paste ${id} in ${formatDuration(performance.now() - before)}`
  );
  return {
    ...paste,
    content: content,
  } as PasteWithContent;
}

/**
 * Expires all pastes that have expired.
 */
export async function expirePastes() {
  // First, get the pastes that will be deleted to clean up S3 files
  const expiredPastes = await getPrismaClient().paste.findMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
    select: {
      id: true,
      ext: true,
    },
  });

  // Delete files from S3
  for (const paste of expiredPastes) {
    try {
      await S3Service.deleteFile(`${paste.id}.${paste.ext}`);
    } catch (error) {
      Logger.error(`Failed to delete S3 file for paste ${paste.id}: ${error}`);
    }
  }

  // Delete database records
  const { count } = await getPrismaClient().paste.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  Logger.info(`Expired ${count} pastes and cleaned up S3 files`);
}

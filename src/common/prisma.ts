import { getLanguage, getLanguageName } from "@/common/utils/lang.util";
import { generatePasteId } from "@/common/utils/paste.util";
import { PrismaClient } from "@/generated/prisma";
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
 * @param deleteAfterRead Whether to delete the paste after first read
 * @returns The created paste.
 */
export async function createPaste(
  content: string,
  expiresAt?: Date,
  deleteAfterRead?: boolean
): Promise<PasteWithContent> {
  if (expiresAt && expiresAt.getTime() < new Date().getTime()) {
    expiresAt = undefined;
  }

  const id = await generatePasteId();
  const ext = await getLanguage(content);
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
          deleteAfterRead: deleteAfterRead || false,
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
 * @param isViewing whether this is a view request (increments views and triggers delete after read).
 * @returns the paste with the given ID.
 */
export async function getPaste(
  id: string,
  isViewing = false
): Promise<PasteWithContent | null> {
  const before = performance.now();

  // Check if the paste exists
  const paste = await getPrismaClient().paste.findUnique({
    where: {
      id: id,
    },
  });
  if (paste == null) {
    return null;
  }

  if (isViewing) {
    // Use update with increment to both update and return data in one call
    await getPrismaClient().paste.update({
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

  const content =
    (await S3Service.getFile(`${id}.${paste.ext}`))?.toString("utf-8") ?? "";

  // Handle delete after read pastes - they get deleted after first view
  if (paste.deleteAfterRead && isViewing) {
    Logger.info(`Triggering delete after read for paste ${id}`);
    await handleDeleteAfterReadPaste(id, paste.ext);
  }

  Logger.info(
    `Got paste ${id} in ${formatDuration(performance.now() - before)}`
  );
  return {
    ...paste,
    content: content,
  } as PasteWithContent;
}

/**
 * Handles deletion of a paste that was marked for delete after read.
 * This function is called after the paste content has been served to the user.
 *
 * @param id The paste ID to delete
 * @param ext The paste file extension
 */
async function handleDeleteAfterReadPaste(
  id: string,
  ext: string
): Promise<void> {
  Logger.info(`Processing delete after read for paste ${id}`);

  try {
    // Delete S3 file first
    await S3Service.deleteFile(`${id}.${ext}`);
    Logger.info(`S3 file deleted for paste ${id}`);

    // Delete database record
    await getPrismaClient().paste.delete({
      where: { id },
    });
    Logger.info(`Database record deleted for paste ${id}`);

    Logger.info(`Paste ${id} successfully deleted after read`);
  } catch (error) {
    Logger.error(`Failed to delete paste ${id} after read: ${error}`);
    // Don't throw - we don't want to break the user experience
  }
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

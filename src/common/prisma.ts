import { getLanguage, getLanguageName } from "@/common/utils/lang.util";
import { generatePasteId } from "@/common/utils/paste.util";
import { PrismaClient } from "@/generated/prisma";
import { PasteWithContent } from "@/types/paste";
import Logger from "./logger";
import S3Service from "./s3";

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
  try {
    await S3Service.saveFile(`${id}.txt`, Buffer.from(content)); // Save the paste to S3

    // Create the paste in the database
    return {
      ...(await getPrismaClient().paste.create({
        data: {
          id: id,
          size: Buffer.byteLength(content),
          expiresAt: expiresAt,
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
  const pasteId = id.split(".")[0];
  const ext = id.split(".")[1]?.toLowerCase() ?? "txt";

  // Check if the paste exists
  const paste = await getPrismaClient().paste.findUnique({
    where: {
      id: pasteId,
    },
  });
  if (paste == null) {
    return null;
  }

  if (isViewing) {
    // Use update with increment to both update and return data in one call
    await getPrismaClient().paste.update({
      where: {
        id: pasteId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }

  const language = await getLanguageName(ext);
  const content =
    (await S3Service.getFile(`${pasteId}.txt`))?.toString("utf-8") ?? "";

  // Handle delete after read pastes - they get deleted after first view
  if (paste.deleteAfterRead && isViewing) {
    Logger.info(`Triggering delete after read for paste ${id}`);
    await handleDeleteAfterReadPaste(pasteId, ext);
  }

  Logger.infoWithTiming(
    `Got paste ${pasteId}`,
    before,
    {
      pasteId: pasteId,
      size: paste.size,
      ext: ext,
      language: language,
      deleteAfterRead: paste.deleteAfterRead,
      expiresAt: paste.expiresAt?.toISOString(),
      isViewing
    }
  );
  return {
    ...paste,
    content: content,
    ext: ext,
    language: language,
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
    await S3Service.deleteFile(`${id}.txt`);
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
    },
  });

  // Delete files from S3
  for (const paste of expiredPastes) {
    try {
      await S3Service.deleteFile(`${paste.id}.txt`);
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

  Logger.info(`Expired ${count} pastes and cleaned up S3 files`, {
    expiredCount: count,
    pastesToCleanup: expiredPastes.length
  });
}

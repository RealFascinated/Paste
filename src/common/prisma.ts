import {Paste, PrismaClient} from "@prisma/client";
import {generatePasteId} from "@/common/utils/paste.util";
import {getLanguage, getLanguageName} from "@/common/utils/lang.util";
import {User} from "better-auth";

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
  const ext = await getLanguage(content);
  return prismaClient.paste.create({
    data: {
      id: await generatePasteId(),
      content: content,
      size: Buffer.byteLength(content),
      ext: ext,
      language: getLanguageName(ext),
      ...(uploader && { ownerId: uploader.id }),
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
export async function getPaste(id: string, incrementViews = false) {
  try {
    if (incrementViews) {
      return await prismaClient.paste.update({
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
    return await prismaClient.paste.findUnique({
      where: {
        id: id,
      },
    });
  } catch {
    return null;
  }
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

/**
 * Gets all pastes for a user.
 *
 * @param user the user to get pastes for.
 * @param options the options to get pastes with.
 * @returns all pastes for the user.
 */
export async function getUsersPastes(
  user: User,
  options?: {
    skip?: number;
    take?: number;
    countOnly?: boolean;
  },
): Promise<{ pastes: Paste[]; totalItems: number }> {
  const count = await prismaClient.paste.count({
    where: {
      ownerId: user.id,
    },
  });
  if (options?.countOnly) {
    return { pastes: [], totalItems: count };
  }

  return {
    pastes: await prismaClient.paste.findMany({
      where: {
        ownerId: user.id,
      },
      ...(options?.skip && { skip: options.skip }),
      ...(options?.take && { take: options.take }),
      orderBy: {
        timestamp: "desc",
      },
    }),
    totalItems: count,
  };
}

/**
 * Gets the statistics for a user.
 *
 * @param user the user to get the statistics for.
 * @returns the statistics for the user.
 */
export async function getUserPasteStatistics(user: User) {
  const count = await prismaClient.paste.count({
    where: {
      ownerId: user.id,
    },
  });

  const views = await prismaClient.paste.aggregate({
    where: {
      ownerId: user.id,
    },
    _sum: {
      views: true,
    },
  });

  return {
    totalPastes: count,
    totalViews: views._sum.views,
  };
}

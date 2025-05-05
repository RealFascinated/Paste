import { Config } from "@/common/config";
import { getPaste, prismaClient } from "@/common/prisma";
import { randomString } from "@/common/utils/string.util";
import { Paste } from "@/types/paste";
import { Paste as PrismaPaste } from "@/generated/prisma/client";
import { cache } from "react";

/**
 * Generates a paste ID.
 *
 * @returns the generated paste ID.
 */
export async function generatePasteId(): Promise<string> {
  let foundId: string | null = null;
  let iterations = 0;

  while (!foundId) {
    iterations++;
    const id = randomString(Config.idLength);
    const paste = await prismaClient.paste.findUnique({
      where: {
        id: id,
      },
    });

    if (!paste) {
      foundId = id;
    }
    if (foundId) {
      break;
    }

    // Attempt to generate an id 100 times,
    // if it fails, return null
    if (iterations > 100) {
      console.error(
        "Failed to generate a unique paste ID after 100 attempts, please increase your paste id length."
      );
      throw new Error("Failed to generate a unique paste ID");
    }
  }

  return foundId;
}

/**
 * Gets a paste from the cache or the database.
 *
 * @param id The ID of the paste to get.
 * @param incrementViews Whether to increment the views of the paste.
 * @returns The paste with the given ID.
 */
export const lookupPaste = cache(
  async (id: string, incrementViews = false): Promise<Paste | null> => {
    const paste = await getPaste(id.split(".")[0], incrementViews);
    if (paste == null) {
      return null;
    }

    return {
      ...paste,
      key: id,
    };
  }
);

/**
 * Adds the additional properties to a paste.
 *
 * @param paste the paste to add the properties to.
 * @returns the paste.
 */
export function getPublicPaste(paste: Paste | PrismaPaste): Paste {
  return {
    ...paste,
    key: paste.id,
  };
}

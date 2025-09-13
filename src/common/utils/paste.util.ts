import { Config } from "@/common/config";
import { getPaste, getPrismaClient } from "@/common/prisma";
import { randomString } from "@/common/utils/string.util";
import { PasteWithContent } from "@/types/paste";
import { Paste as PrismaPaste } from "@/generated/prisma/client";
import { cache } from "react";

/**
 * Generates a paste ID.
 *
 * @returns the generated paste ID.
 */
export async function generatePasteId(): Promise<string> {
  let id: string;
  let paste: PrismaPaste | null;
  do {
    id = randomString(Config.idLength);
    paste = await getPrismaClient().paste.findUnique({
      where: {
        id: id,
      },
    });
  } while (paste !== null);
  return id;
}

/**
 * Gets a paste from the cache or the database.
 *
 * @param id The ID of the paste to get.
 * @param incrementViews Whether to increment the views of the paste.
 * @returns The paste with the given ID.
 */
export const lookupPaste = cache(
  async (id: string, incrementViews = false): Promise<PasteWithContent | null> => {
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

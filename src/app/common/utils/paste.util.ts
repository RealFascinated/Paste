import { getPaste, prismaClient } from "@/app/common/prisma";
import { randomString } from "@/app/common/utils/string.util";
import { Config } from "@/app/common/config";
import { cache } from "react";
import { getLanguageName } from "@/app/common/utils/lang.util";
import { PasteWithLang } from "@/app/types/paste";

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
        "Failed to generate a unique paste ID after 100 attempts, please increase your paste id length.",
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
 * @returns The paste with the given ID.
 */
export const lookupPaste = cache(
  async (id: string): Promise<PasteWithLang | null> => {
    const paste = await getPaste(id);
    if (paste == null) {
      return null;
    }

    return {
      ...paste,
      lang: paste.lang === "text" ? "txt" : paste.lang,
      formattedLang:
        (paste.lang === "text" ? "Text" : getLanguageName(paste.lang)) ??
        paste.lang,
    };
  },
);

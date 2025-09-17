import { Config } from "@/common/config";
import { getPaste, getPrismaClient } from "@/common/prisma";
import { randomString } from "@/common/utils/string.util";
import { Paste as PrismaPaste } from "@/generated/prisma/client";
import { PasteWithContent } from "@/types/paste";
import { getLanguageName } from "./lang.util";

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
 * Gets a paste from the database and formats it with the key.
 *
 * @param id The ID of the paste to get.
 * @param isViewing Whether this is a view request (increments views and triggers delete after read).
 * @returns The paste with the given ID.
 */
export async function lookupPaste(
  id: string,
  isViewing = false
): Promise<PasteWithContent | null> {
  const pasteId = id.split(".")[0];

  const paste = await getPaste(pasteId, isViewing);
  if (paste == null) {
    return null;
  }

  return {
    ...paste,
    key: id,
  };
}

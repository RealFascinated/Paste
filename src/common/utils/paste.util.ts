import { Config } from "@/common/config";
import { getPrismaClient } from "@/common/prisma";
import { randomString } from "@/common/utils/string.util";
import { Paste as PrismaPaste } from "@/generated/prisma/client";

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

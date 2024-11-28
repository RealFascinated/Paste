import { Paste as PrismaPaste } from "@prisma/client";

export type Paste = PrismaPaste & {
  /**
   * The paste's ID.
   */
  key: string;

  /**
   * The paste's extension.
   */
  ext: string;

  /**
   * The formatted language name.
   */
  formattedLang: string;
};

import { Paste as PrismaPaste } from "@/generated/prisma/client";

export type PasteWithContent = PrismaPaste & {
  /**
   * The paste's ID.
   */
  key: string;

  /**
   * The paste's extension.
   */
  ext: string;

  /**
   * The paste's language.
   */
  language: string;

  /**
   * The paste's content.
   */
  content: string;

  /**
   * The number of lines in the paste.
   */
  lineCount: number;
};

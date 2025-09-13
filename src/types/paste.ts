import { Paste as PrismaPaste } from "@/generated/prisma/client";

export type PasteWithContent = PrismaPaste & {
  /**
   * The paste's ID.
   */
  key: string;

  /**
   * The paste's content.
   */
  content: string;
};

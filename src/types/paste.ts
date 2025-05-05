import { Paste as PrismaPaste } from "@/generated/prisma/client";

export type Paste = PrismaPaste & {
  /**
   * The paste's ID.
   */
  key: string;
};

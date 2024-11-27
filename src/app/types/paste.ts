import { Paste } from "@prisma/client";

export type PasteWithLang = Paste & {
  formattedLang: string;
};

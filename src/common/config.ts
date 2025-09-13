import Logger from "./logger";

export const Config = {
  idLength: Number(process.env.PASTE_ID_LENGTH) ?? 8,
  maxPasteSize: Number(process.env.PASTE_MAX_SIZE) ?? 1024 * 50, // 50 KB
  maxExpiryLength:
    Number(process.env.PASTE_MAX_EXPIRY_LENGTH) ?? 60 * 60 * 24 * 365, // 1 year
  hastebinUploadEndpoint: process.env.HASTEBIN_UPLOAD_ENDPOINT ?? "/documents",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://paste.fascinated.cc",
  siteTitle: process.env.NEXT_PUBLIC_SITE_TITLE ?? "Paste",
  pastePlaceholder:
    process.env.NEXT_PUBLIC_PASTE_PLACEHOLDER ?? "Paste your text here...",
} as const;

/**
 * Validate the config
 */
if (Config.idLength <= 0) {
  Logger.error(
    "Invalid paste id length, please set PASTE_ID_LENGTH to a positive integer."
  );
  process.exit(1);
}

if (Config.maxPasteSize <= 0) {
  Logger.error(
    "Invalid paste max size, please set PASTE_MAX_SIZE to a positive integer."
  );
  process.exit(1);
}

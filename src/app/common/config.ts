export const Config = {
  idLength: Number(process.env.PASTE_ID_LENGTH) ?? 8,
  maxLength: Number(process.env.PASTE_MAX_LENGTH) ?? 500_000,
  maxExpiryLength:
    Number(process.env.PASTE_MAX_EXPIRY_LENGTH) ?? 60 * 60 * 24 * 30, // 30 days
  websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000",
};

/**
 * Validate the config
 */
if (Config.idLength <= 0) {
  console.error(
    "Invalid paste id length, please set PASTE_ID_LENGTH to a positive integer.",
  );
  process.exit(1);
}

if (Config.maxLength <= 0) {
  console.error(
    "Invalid paste max length, please set PASTE_MAX_LENGTH to a positive integer.",
  );
  process.exit(1);
}

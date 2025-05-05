/**
 * Generates a random string of the given length.
 *
 * @param length The length of the string to generate.
 * @returns The generated string.
 */
export function randomString(length: number) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Formats a number of bytes into a human-readable string.
 *
 * @param bytes The number of bytes to format.
 * @param decimals The number of decimal places to round to.
 * @returns The formatted string.
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Formats a number as a string.
 *
 * @param number The number to format.
 * @returns The formatted string.
 */
export function formatNumber(number: number) {
  return number.toLocaleString();
}

/**
 * Truncates text to the given length.
 *
 * @param text the text to truncate.
 * @param maxLength the length to truncate at.
 */
export function truncateText(
  text: string | undefined,
  maxLength: number
): string | undefined {
  if (!text) {
    return undefined;
  }
  return text.length > maxLength
    ? text.slice(0, maxLength - 3).trim() + "..."
    : text;
}

/**
 * Gets the lines of text.
 *
 * @param text the text to get the lines of.
 * @param lineCount the number of lines to get.
 * @returns the lines of text.
 */
export function getLines(text: string | undefined, lineCount: number) {
  if (!text) {
    return [];
  }
  const lines = text.split("\n");
  return lines.slice(0, lineCount);
}

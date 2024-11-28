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
  if (bytes === 0) {
    return "0 KB";
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k)) + 1;
  const sizeInUnit = bytes / Math.pow(k, i + 1);

  return parseFloat(sizeInUnit.toFixed(dm)) + " " + sizes[i];
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

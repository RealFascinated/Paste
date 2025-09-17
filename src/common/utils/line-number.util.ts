/**
 * Calculate the dynamic width for line numbers based on the total line count
 *
 * @param lineCount the total number of lines
 * @returns the width in pixels for the line numbers container
 */
export function calculateLineNumberWidth(lineCount: number): number {
  const digits = lineCount.toString().length;
  return Math.max(3, digits) * 8 + 24; // 8px per digit + 24px for padding
}

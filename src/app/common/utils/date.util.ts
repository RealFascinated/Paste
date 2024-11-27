/**
 * Formats a date as a relative time.
 *
 * @param date The date to format.
 * @returns The formatted date.
 */
export function getRelativeTime(date: Date | string | number): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const targetDate = new Date(date);

  const diffMs = targetDate.getTime() - now.getTime();
  const absDiff = Math.abs(diffMs);

  const timeUnits: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
    ["second", 1000],
  ];

  for (const [unit, msInUnit] of timeUnits) {
    if (absDiff >= msInUnit || unit === "second") {
      const value = Math.round(diffMs / msInUnit);
      return rtf.format(value, unit);
    }
  }

  return "just now";
}

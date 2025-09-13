import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

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

/**
 * Formats a duration in the format "Xd, Xh, Xm, Xs"
 * showing at most two units for simplicity.
 *
 * @param ms - Duration in milliseconds
 * @returns The formatted duration
 */
export function formatDuration(ms: number, long: boolean = false): string {
  if (ms < 0) ms = -ms;

  const duration = dayjs.duration(ms);
  const units = [
    { value: duration.days(), unit: long ? "Days" : "d" },
    { value: duration.hours(), unit: long ? "Hours" : "h" },
    { value: duration.minutes(), unit: long ? "Minutes" : "m" },
    { value: duration.seconds(), unit: long ? "Seconds" : "s" },
    { value: duration.milliseconds(), unit: long ? "Milliseconds" : "ms" },
  ];

  const result = units
    .filter(u => u.value > 0)
    .slice(0, 2)
    .map(u => `${u.value.toFixed(0)}${u.unit}`);

  return result.join(", ") || (long ? "0 Seconds" : "0s");
}

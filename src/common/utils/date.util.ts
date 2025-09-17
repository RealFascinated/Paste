import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

/**
 * This function returns the time ago of the input date
 *
 * @param input Date | string | number (timestamp)
 * @returns the format of the time ago
 */
export function getRelativeTime(input: Date | string | number): string {
  const inputDate = new Date(input).getTime(); // Convert input to a Date object if it's not already
  const now = new Date().getTime();
  const deltaSeconds = Math.floor((now - inputDate) / 1000); // Get time difference in seconds

  // Handle "just now" for very recent times
  if (Math.abs(deltaSeconds) <= 5) {
    return "just now";
  }

  const timeUnits = [
    { unit: "y", seconds: 60 * 60 * 24 * 365 }, // years
    { unit: "mo", seconds: 60 * 60 * 24 * 30 }, // months
    { unit: "d", seconds: 60 * 60 * 24 }, // days
    { unit: "h", seconds: 60 * 60 }, // hours
    { unit: "m", seconds: 60 }, // minutes
    { unit: "s", seconds: 1 }, // seconds
  ];

  const result = [];
  let remainingSeconds = Math.abs(deltaSeconds);

  for (const { unit, seconds } of timeUnits) {
    const count = Math.floor(remainingSeconds / seconds);
    if (count > 0) {
      result.push(`${count}${unit}`);
      remainingSeconds -= count * seconds;
    }
    // Stop after two units have been added
    if (result.length === 2) break;
  }

  // Return formatted result with at most two units
  const suffix = deltaSeconds > 0 ? " ago" : " from now";
  return result.join(", ") + suffix;
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

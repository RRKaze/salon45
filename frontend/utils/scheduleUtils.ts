import { DateTime } from "luxon";

/**
 * Formats a date using user's locale
 * @param input Should be a date in ISO format (e.g. 2024-01-31) without TZ nor time information
 * @returns Formatted date
 */
export function formatDate(input: string, format: Intl.DateTimeFormatOptions = DateTime.DATE_MED): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    return "";
  }
  const date = DateTime.fromISO(input);
  return date.isValid ? date.toLocaleString(format) : "";
}

/**
 * Formats time using user's locale
 * @param t Should be hours and minutes in ISO format (e.g. 23:42) without TZ nor date information
 * @returns Formatted time
 */
export function toDisplayTime(t: string): string {
  if (!/^(\d{2}:\d{2})$/.test(t)) {
    return "";
  }
  const time = DateTime.fromISO(t);
  return time.isValid
    ? time.toLocaleString(DateTime.TIME_SIMPLE)
    : "";
}

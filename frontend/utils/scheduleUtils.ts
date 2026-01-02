import { DateTime } from "luxon";

const EST_TIMEZONE = "America/New_York";

/**
 * Formats a date using EST timezone
 * @param input Should be a date in ISO format (e.g. 2024-01-31) or ISO datetime string in UTC
 * @returns Formatted date in EST
 */
export function formatDate(input: string, format: Intl.DateTimeFormatOptions = DateTime.DATE_MED): string {
  if (!input) {
    return "";
  }
  
  // If it's a date-only string (YYYY-MM-DD), parse it directly in EST
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const date = DateTime.fromISO(input, { zone: EST_TIMEZONE });
    return date.isValid ? date.toLocaleString(format) : "";
  }
  
  // If it's an ISO datetime string (from database in UTC), parse as UTC and convert to EST
  const date = DateTime.fromISO(input, { zone: "utc" }).setZone(EST_TIMEZONE);
  return date.isValid ? date.toLocaleString(format) : "";
}

/**
 * Formats time using EST timezone
 * @param t Should be hours and minutes in ISO format (e.g. 23:42) or ISO datetime string in UTC
 * @returns Formatted time in EST
 */
export function toDisplayTime(t: string): string {
  if (!t) {
    return "";
  }
  
  // If it's a time-only string (HH:mm), create a DateTime in EST timezone
  if (/^(\d{2}:\d{2})$/.test(t)) {
    const today = DateTime.now().setZone(EST_TIMEZONE);
    const [hours, minutes] = t.split(":").map(Number);
    const time = today.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
    return time.isValid ? time.toLocaleString(DateTime.TIME_SIMPLE) : "";
  }
  
  // If it's an ISO datetime string (from database in UTC), parse as UTC and convert to EST
  const time = DateTime.fromISO(t, { zone: "utc" }).setZone(EST_TIMEZONE);
  return time.isValid ? time.toLocaleString(DateTime.TIME_SIMPLE) : "";
}

/**
 * Formats a datetime string to EST timezone
 * @param isoString ISO datetime string in UTC (e.g. from database)
 * @returns Formatted datetime in EST
 */
export function formatDateTime(isoString: string, format: Intl.DateTimeFormatOptions = DateTime.DATETIME_MED): string {
  if (!isoString) {
    return "";
  }
  // Parse as UTC (ISO strings from backend are in UTC)
  // Then convert to EST timezone for display
  const date = DateTime.fromISO(isoString, { zone: "utc" }).setZone(EST_TIMEZONE);
  return date.isValid ? date.toLocaleString(format) : "";
}

import { format, parseISO } from "date-fns";

/**
 * Formats an ISO date string into a specified date-time pattern.
 *
 * @param isoString ISO 8601 formatted date string
 * @param pattern Date format pattern (default: "yyyy/MM/dd HH:mm")
 * @returns Formatted date-time string
 */
export const formatDate = (
  isoString: string,
  pattern = "yyyy/MM/dd HH:mm"
): string => {
  return format(parseISO(isoString), pattern);
};

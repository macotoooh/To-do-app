import { format, parseISO } from "date-fns";

/**
 * Formats an Date into a yyyy/MM/dd HH:mm pattern.
 *
 * @param date date
 *
 * @returns Formatted date-time string
 */
export const formatDate = (date: Date): string => {
  return format(date, "yyyy/MM/dd HH:mm");
};

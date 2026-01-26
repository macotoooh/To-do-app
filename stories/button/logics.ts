import type { ButtonColorValue } from "./types";

const colorToClass: Record<ButtonColorValue, string> = {
  PRIMARY: "bg-primary-bg text-white ",
  NEUTRAL: "bg-neutral-bg text-white ",
  NEW: "bg-new-bg text-new-text",
  DANGER: "bg-danger-bg text-white",
  OUTLINE: "bg-white text-gray border border-gray-400",
};

/**
 * Returns the Tailwind background color class for a given Button color.
 * @param color - The Button color value (e.g., 'YELLOW', 'BLUE')
 * @returns The corresponding Tailwind CSS background color class
 */
export const getButtonColorClass = (color: ButtonColorValue) => {
  return colorToClass[color];
};

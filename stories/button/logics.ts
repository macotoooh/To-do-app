import type { ButtonColorValue } from "./types";

const colorToClass: Record<ButtonColorValue, string> = {
  PRIMARY: "bg-[#84C94B] text-white ",
  NEUTRAL: "bg-[#D9D9D9] text-white ",
  NEW: "bg-[#E0F2FE] text-[#0284C7]",
  DANGER: "bg-[#FF6F6F] text-white ",
};

/**
 * Returns the Tailwind background color class for a given Button color.
 * @param color - The Button color value (e.g., 'YELLOW', 'BLUE')
 * @returns The corresponding Tailwind CSS background color class
 */
export const getButtonColorClass = (color: ButtonColorValue) => {
  return colorToClass[color];
};

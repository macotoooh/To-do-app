import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonColorValue } from "./types";
import { getButtonColorClass } from "./logics";
import { BUTTON_VARIANT } from "./constants";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  color: ButtonColorValue;
  testId?: string;
};

/**
 * Common Button component
 *
 * @param {ReactNode} children - The button label (e.g., 'save', 'delete')
 * @param {ButtonColorValue} color - Visual variant for the button style
 * @param testId - Optional test ID for querying this button in unit tests
 *
 * @returns {JSX.Element} A styled button element with variant-based coloring
 */
export const AppButton = ({
  children,
  color = BUTTON_VARIANT.primary,
  testId,
  ...props
}: AppButtonProps) => {
  const buttonStyle = getButtonColorClass(color);
  return (
    <button
      {...props}
      className={`
        px-4 py-2 rounded-md text-sm font-medium
        hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed
        transition
        ${buttonStyle}
      `}
      data-testid={testId ?? ""}
    >
      {children}
    </button>
  );
};

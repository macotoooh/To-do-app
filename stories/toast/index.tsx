import type { ReactNode } from "react";
import { SUCCESS_TOAST } from "./constants";
import type { ToastVariant } from "./types";

type AppToastProps = {
  children: ReactNode;
  variant?: ToastVariant;
};

/**
 * Common Toast component for displaying feedback messages.
 *
 * @param children - The toast message content
 * @param variant - Visual style of the toast (SUCCESS_TOAST or ERROR_TOAST)
 *
 * @returns A styled toast element
 */
export const AppToast = ({
  children,
  variant = SUCCESS_TOAST,
}: AppToastProps) => {
  return (
    <div
      className={`text-base font-bold my-2 p-2 ${
        variant === SUCCESS_TOAST
          ? "text-success-text bg-success-bg"
          : "text-error-text bg-error-bg"
      }`}
    >
      {children}
    </div>
  );
};

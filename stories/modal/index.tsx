import { useEffect, type ReactNode } from "react";
import type { ButtonColorValue } from "stories/button/types";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";

type AppModalProps = {
  title: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmColor?: ButtonColorValue;
  cancelColor?: ButtonColorValue;
  onConfirm: () => void;
  onCancel?: () => void;
  children?: ReactNode;
  panelClassName?: string;
  allowOverlayClose?: boolean;
  allowEscapeClose?: boolean;
};

/**
 * Common reusable modal component for confirmation dialogs.
 *
 * @param title - The modal's main message or title text
 * @param confirmLabel - Text to display on the confirm button
 * @param cancelLabel - Text to display on the cancel button (optional)
 * @param confirmColor - Button variant color for the confirm button (default: "DANGER")
 * @param cancelColor - Button variant color for the cancel button (default: "NEUTRAL")
 * @param onConfirm - Callback function triggered when the confirm button is clicked
 * @param onCancel - Callback function triggered when the cancel button is clicked (optional)
 * @param children - Optional custom content rendered between title and actions
 * @param panelClassName - Optional class name to customize modal panel size/layout
 * @param allowOverlayClose - Whether clicking the backdrop should close the modal
 * @param allowEscapeClose - Whether pressing Escape should close the modal
 *
 * @returns A modal JSX element rendered at the center of the screen with overlay background
 */

export const AppModal = ({
  title,
  confirmLabel,
  cancelLabel,
  confirmColor = BUTTON_VARIANT.danger,
  cancelColor = BUTTON_VARIANT.neutral,
  onConfirm,
  onCancel,
  children,
  panelClassName,
  allowOverlayClose = false,
  allowEscapeClose = false,
}: AppModalProps) => {
  useEffect(() => {
    if (!allowEscapeClose || !onCancel) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allowEscapeClose, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={(event) => {
        if (!allowOverlayClose || !onCancel) return;
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className={`bg-white w-96 p-6 rounded-lg shadow-xl ${
          panelClassName ?? ""
        }`}
      >
        <h3 className="text-xl font-semibold mb-6">{title}</h3>
        {children && <div className="mb-6">{children}</div>}
        <div className="flex justify-end gap-3">
          {cancelLabel && onCancel && (
            <AppButton onClick={onCancel} color={cancelColor}>
              {cancelLabel}
            </AppButton>
          )}
          <AppButton
            onClick={onConfirm}
            color={confirmColor}
            testId="confirm-delete-modal"
          >
            {confirmLabel}
          </AppButton>
        </div>
      </div>
    </div>
  );
};

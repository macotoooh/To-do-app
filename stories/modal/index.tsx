import type { ButtonHTMLAttributes, ReactNode } from "react";
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
}: AppModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="flex justify-end gap-3">
          {cancelLabel && onCancel && (
            <AppButton onClick={onCancel} color={cancelColor}>
              {cancelLabel}
            </AppButton>
          )}
          <AppButton onClick={onConfirm} color={confirmColor}>
            {confirmLabel}
          </AppButton>
        </div>
      </div>
    </div>
  );
};

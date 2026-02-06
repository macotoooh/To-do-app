import { SUMMARY_CARD_VARIANT } from "./constants";
import type { SummaryCardVariant } from "./types";

type AppSummaryCardProps = {
  label: string;
  value: number;
  variant?: SummaryCardVariant;
  isActive?: boolean;
  onClick?: () => void;
};

/**
 * Summary card for simple metric display.
 *
 * @param label - Metric label
 * @param value - Metric value
 * @param variant - Color style variant
 * @param isActive - Whether the card is currently selected
 * @param onClick - Optional click handler to make the card interactive
 */
export const AppSummaryCard = ({
  label,
  value,
  variant = SUMMARY_CARD_VARIANT.neutral,
  isActive = false,
  onClick,
}: AppSummaryCardProps) => {
  const variantToClass = {
    [SUMMARY_CARD_VARIANT.neutral]: {
      container: "bg-surface-bg",
      label: "text-gray-500",
      value: "",
    },
    [SUMMARY_CARD_VARIANT.todo]: {
      container: "bg-status-todo-bg",
      label: "text-status-todo-text",
      value: "text-status-todo-text",
    },
    [SUMMARY_CARD_VARIANT.doing]: {
      container: "bg-status-doing-bg",
      label: "text-status-doing-text",
      value: "text-status-doing-text",
    },
    [SUMMARY_CARD_VARIANT.done]: {
      container: "bg-status-done-bg",
      label: "text-status-done-text",
      value: "text-status-done-text",
    },
  };

  const style = variantToClass[variant];
  const baseClass = `rounded-md p-3 ${style.container} ${
    isActive ? "ring-2 ring-form-border" : "ring-1 ring-transparent"
  }`;

  if (!onClick) {
    return (
      <div className={baseClass}>
        <p className={`text-xs ${style.label}`}>{label}</p>
        <p className={`text-2xl font-bold ${style.value}`}>{value}</p>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`${baseClass} w-full cursor-pointer text-left transition-opacity hover:opacity-90`}
    >
      <p className={`text-xs ${style.label}`}>{label}</p>
      <p className={`text-2xl font-bold ${style.value}`}>{value}</p>
    </button>
  );
};

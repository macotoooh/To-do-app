import { SUMMARY_CARD_VARIANT } from "./constants";
import type { SummaryCardVariant } from "./types";

type AppSummaryCardProps = {
  label: string;
  value: number;
  variant?: SummaryCardVariant;
};

/**
 * Summary card for simple metric display.
 *
 * @param label - Metric label
 * @param value - Metric value
 * @param variant - Color style variant
 */
export const AppSummaryCard = ({
  label,
  value,
  variant = SUMMARY_CARD_VARIANT.neutral,
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

  return (
    <div className={`rounded-md p-3 ${style.container}`}>
      <p className={`text-xs ${style.label}`}>{label}</p>
      <p className={`text-2xl font-bold ${style.value}`}>{value}</p>
    </div>
  );
};

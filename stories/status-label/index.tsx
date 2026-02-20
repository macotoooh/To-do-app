import type { StatusLabelTone, StatusVariant } from "./types";

type AppStatusLabelProps = {
  status: string;
  tone?: StatusLabelTone;
};

/**
 * A common, reusable label component for task statuses.
 *
 * Renders a color-coded badge based on the provided task status.
 * This component is typically used in list views, detail pages, and forms.
 *
 * @param {AppStatusLabelProps} props - The component props
 * @param {string} props.status - The label text to render
 * @param {StatusLabelTone} props.tone - Visual tone ("task" | "ai")
 *
 * @returns {JSX.Element} A styled span element representing the status label
 */
export const AppStatusLabel = ({ status, tone = "task" }: AppStatusLabelProps) => {
  const statusToClass: Record<StatusVariant, string> = {
    TODO: "bg-status-todo-bg text-status-todo-text",
    DOING: "bg-status-doing-bg text-status-doing-text",
    DONE: "bg-status-done-bg text-status-done-text",
  };
  const toneToClass: Record<StatusLabelTone, string> = {
    task: statusToClass[status as StatusVariant] ?? "bg-gray-100 text-gray-600",
    ai: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${toneToClass[tone]}`}
    >
      {status}
    </span>
  );
};

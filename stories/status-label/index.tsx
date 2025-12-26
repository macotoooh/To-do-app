import type { StatusVariant } from "./types";

type AppStatusLabelProps = {
  status: StatusVariant;
};

/**
 * A common, reusable label component for task statuses.
 *
 * Renders a color-coded badge based on the provided task status.
 * This component is typically used in list views, detail pages, and forms.
 *
 * @param {AppStatusLabelProps} props - The component props
 * @param {StatusVariant} props.status - The task status value (e.g., TODO, DOING, DONE)
 *
 * @returns {JSX.Element} A styled span element representing the status label
 */
export const AppStatusLabel = ({ status }: AppStatusLabelProps) => {
  const statusToClass = {
    TODO: "bg-[#FFF1F1] text-[#FF6F6F]",
    DOING: "bg-[#FFFBEB] text-[#F59E0B]",
    DONE: "bg-[#ECFDF5] text-[#10B981]",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusToClass[status]}`}
    >
      {status}
    </span>
  );
};

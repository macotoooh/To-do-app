type Props = {
  status?: number;
  title?: string;
  description?: string;
  action?: React.ReactNode;
};

/**
 * A reusable UI component for displaying error states.
 *
 * @param props - Error display options including status, title,
 * description, and optional action elements.
 */
export const ErrorState = ({
  status,
  title = "Something went wrong",
  description,
  action,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-2 py-10">
      {status && <h1 className="text-4xl font-bold">{status}</h1>}
      <p className="text-lg">{title}</p>
      {description && <p className="text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
};

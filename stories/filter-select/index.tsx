type Option = {
  label: string;
  value: string;
};

type AppFilterSelectProps = {
  id: string;
  label?: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

/**
 * A reusable select component for list filtering and sorting controls.
 *
 * @param id - The input id used for label association
 * @param label - Optional label displayed above the select
 * @param value - Current selected value
 * @param options - Selectable options
 * @param onChange - Callback fired when selection changes
 */
export const AppFilterSelect = ({
  id,
  label,
  value,
  options,
  onChange,
}: AppFilterSelectProps) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-xs text-gray-500" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className="h-10 w-full rounded-md border border-form-border bg-white px-3 text-sm"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

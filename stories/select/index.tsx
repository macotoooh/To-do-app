import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { StatusVariant } from "stories/status-label/types";

type Option = {
  label: string;
  value: string;
};

type AppSelectProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  label?: string;
  placeholder?: string;
  errorText?: string;
  status?: StatusVariant;
};

/**
 * A reusable select dropdown integrated with React Hook Form.
 *
 * @param name - The field name used by React Hook Form.
 * @param control - The control object from useForm().
 * @param label - Optional label displayed above the input.
 * @param placeholder - Optional placeholder text for the input.
 * @param errorText - Optional error message shown below the input.
 * @param options - Array of selectable options.
 * @param status - Optional task status value
 */
export const AppSelect = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  errorText,
  options,
  status,
}: AppSelectProps<T>) => {
  const { field } = useController({ name, control });
  const statusToClass = {
    TODO: "bg-[#FFF1F1] text-[#FF6F6F]",
    DOING: "bg-[#FFFBEB] text-[#F59E0B]",
    DONE: "bg-[#ECFDF5] text-[#10B981]",
  };

  return (
    <>
      <div className="space-y-1">
        {label && <label className="text-sm">{label}</label>}
        <select
          {...field}
          className={`w-full p-2 border border-gray-500 rounded-md font-bold ${status ? statusToClass[status] : ""} ${errorText ? "bg-red-100 text-red-500" : ""}`}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {errorText && <p className="text-red-500 text-sm">{errorText}</p>}
    </>
  );
};

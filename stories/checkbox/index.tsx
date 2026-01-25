import { type Control, type FieldValues, type Path } from "react-hook-form";
import { useAppCheckbox } from "./logics";

type Option = {
  label: string;
  value: string;
};

type AppCheckboxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  errorText?: string;
};

/**
 * A reusable checkbox group integrated with React Hook Form.
 *
 * @param name - The field name used by React Hook Form.
 * @param control - The control object from useForm().
 * @param errorText - Optional error message shown below the input.
 * @param options - Array of selectable options.
 */
export const AppCheckbox = <T extends FieldValues>({
  name,
  control,
  options,
  errorText,
}: AppCheckboxProps<T>) => {
  const { values, toggle } = useAppCheckbox(name, control);

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        {options.map((opt) => {
          const checked = values.includes(opt.value);

          return (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt.value)}
                className="h-4 w-4 rounded"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      {errorText && <p className="text-error-text text-sm">{errorText}</p>}
    </div>
  );
};

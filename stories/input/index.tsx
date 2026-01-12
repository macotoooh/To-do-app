import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type AppInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  errorText?: string;
};

/**
 * A reusable input component integrated with React Hook Form.
 *
 * @param name - The field name used by React Hook Form.
 * @param control - The control object from useForm().
 * @param label - Optional label displayed above the input.
 * @param placeholder - Optional placeholder text for the input.
 * @param errorText - Optional error message shown below the input.
 *
 * @returns The controlled input component.
 */
export const AppInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  errorText,
}: AppInputProps<T>) => {
  const { field } = useController({ name, control });

  return (
    <>
      <div className="space-y-1">
        {label && (
          <label htmlFor={field.name} className="text-sm">
            {label}
          </label>
        )}
        <input
          {...field}
          id={field.name}
          placeholder={placeholder}
          className={`w-full p-2 border border-form-border rounded-md ${errorText ? "bg-error-bg text-error-text" : ""}`}
        />
      </div>
      {errorText && <p className="text-error-text text-sm">{errorText}</p>}
    </>
  );
};

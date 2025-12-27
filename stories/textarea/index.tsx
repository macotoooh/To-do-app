import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type AppTextareaProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  errorText?: string;
  rows?: number;
};

/**
 * A reusable textarea component integrated with React Hook Form.
 *
 * @param name - The field name used by React Hook Form.
 * @param control - The control object from useForm().
 * @param label - Optional label displayed above the textarea.
 * @param placeholder - Optional placeholder text for the textarea.
 * @param errorText - Optional error message shown below the textarea.
 * @param rows - Optional number of visible text lines in the textarea.
 *
 * @returns The controlled textarea component.
 */
export const AppTextarea = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  errorText,
  rows = 3,
}: AppTextareaProps<T>) => {
  const { field } = useController({ name, control });

  return (
    <>
      <div className="space-y-1">
        {label && <label className="text-sm">{label}</label>}
        <textarea
          {...field}
          placeholder={placeholder}
          className={`w-full p-2 border border-gray-500 rounded-md resize-none ${errorText ? "bg-red-100 text-red-500" : ""}`}
          rows={rows}
        />
      </div>
      {errorText && <p className="text-red-500 text-sm">{errorText}</p>}
    </>
  );
};

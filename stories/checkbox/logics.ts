import {
  useController,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

/**
 * A custom hook for managing a checkbox group with React Hook Form.
 *
 * @param name - The field name registered in the form.
 * @param control - The control object from useForm().
 * @returns The current values and a toggle function for checkbox items.
 */
export const useAppCheckbox = <T extends FieldValues>(
  name: Path<T>,
  control: Control<T>,
) => {
  const { field } = useController({
    name,
    control,
  });

  const values: string[] = field.value ?? [];

  const toggle = (value: string) => {
    if (values.includes(value)) {
      field.onChange(values.filter((v) => v !== value));
      return;
    }
    field.onChange([...values, value]);
  };

  return { values, toggle };
};

import {
  Controller,
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

export const AppInput = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  errorText,
}: AppInputProps<T>) => {
  return (
    <>
      <div className="space-y-1">
        {label && <label>{label}</label>}
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder={placeholder}
              className="w-full p-2 border"
            />
          )}
        />
      </div>
      {errorText && <>{errorText}</>}
    </>
  );
};

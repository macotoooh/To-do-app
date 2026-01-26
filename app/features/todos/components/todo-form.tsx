import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { AppInput } from "stories/input";
import { AppSelect } from "stories/select";
import { AppTextarea } from "stories/textarea";
import { TASK_STATUS, type TaskStatus } from "~/constants/tasks";

type TodoFormProps<T extends FieldValues> = {
  control: Control<T>;
  titleName: Path<T>;
  statusName: Path<T>;
  contentName: Path<T>;
  errors: FieldErrors<T>;
  onSubmit: () => void;
  statusValue: TaskStatus;
  children: React.ReactNode;
};

/**
 * Common TodoForm component
 *
 * This form is shared between the Create Todo and Todo Detail pages.
 * It is fully type-safe via generics and works with React Hook Form and Remix.
 *
 * @template T - Type of form values, must extend FieldValues
 *
 * @param control - React Hook Form's control object to manage the form state
 * @param titleName - Field name used for the title input
 * @param statusName - Field name used for the status select box
 * @param contentName - Field name used for the content textarea
 * @param errors - Field error messages returned by useForm
 * @param onSubmit - Callback function executed on form submit
 * @param statusValue - Currently selected status value (e.g. "TODO", "DOING", "DONE")
 * @param children - Additional form content
 *
 * @returns JSX.Element - The rendered form
 */
export const TodoForm = <T extends FieldValues>({
  control,
  titleName,
  statusName,
  contentName,
  errors,
  onSubmit,
  statusValue,
  children,
}: TodoFormProps<T>) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <AppInput
        name={titleName}
        control={control}
        label="Title"
        placeholder="Enter title"
        errorText={
          typeof errors.title?.message === "string"
            ? errors.title.message
            : undefined
        }
      />

      <AppSelect
        name={statusName}
        control={control}
        label="Status"
        placeholder="Select status"
        options={[
          { label: "To do", value: TASK_STATUS.TODO },
          { label: "Doing", value: TASK_STATUS.DOING },
          { label: "Done", value: TASK_STATUS.DONE },
        ]}
        errorText={
          typeof errors.status?.message === "string"
            ? errors.status.message
            : undefined
        }
        status={statusValue}
      />

      <AppTextarea
        name={contentName}
        control={control}
        label="Content"
        placeholder="Enter content"
        errorText={
          typeof errors.content?.message === "string"
            ? errors.content.message
            : undefined
        }
        rows={5}
      />
      {children}
    </form>
  );
};

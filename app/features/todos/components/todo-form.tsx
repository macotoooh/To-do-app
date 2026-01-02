import { useState } from "react";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Form } from "react-router";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { AppInput } from "stories/input";
import { AppModal } from "stories/modal";
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
  isSubmitting?: boolean;
  onDelete?: () => void;
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
 * @param isSubmitting - Optional flag indicating whether the form is submitting
 * @param onDelete - Called when the Delete button in the modal is clicked to delete a task.
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
  isSubmitting = false,
  onDelete,
}: TodoFormProps<T>) => {
  const [isOpenModal, setOpenModal] = useState(false);
  return (
    <>
      <Form method="post" className="space-y-4" onSubmit={onSubmit}>
        <AppInput
          name={titleName}
          control={control}
          label="Title"
          placeholder="Enter title"
          errorText={errors.title?.message as string | undefined}
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
          errorText={errors.status?.message as string | undefined}
          status={statusValue}
        />

        <AppTextarea
          name={contentName}
          control={control}
          label="Content"
          placeholder="Enter content"
          errorText={errors.content?.message as string | undefined}
          rows={5}
        />

        <div className="flex gap-x-2 justify-end pt-4">
          <AppButton
            type="button"
            color={BUTTON_VARIANT.danger}
            onClick={() => setOpenModal(!isOpenModal)}
          >
            Delete
          </AppButton>
          <AppButton
            color={BUTTON_VARIANT.primary}
            type="submit"
            disabled={isSubmitting}
          >
            Save
          </AppButton>
        </div>
      </Form>
      {isOpenModal && onDelete && (
        <AppModal
          title="Delete this item?"
          confirmLabel="Delete"
          onConfirm={() => {
            setOpenModal(!isOpenModal);
            onDelete();
          }}
        />
      )}
    </>
  );
};

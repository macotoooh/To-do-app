import { type CreateTaskInput } from "~/schemas/task";
import { TASK_STATUS } from "~/constants/tasks";
import {
  Form,
  redirect,
  useActionData,
  type ActionFunctionArgs,
} from "react-router";
import { AppInput } from "stories/input";
import { AppTextarea } from "stories/textarea";

import { createTask } from "~/server/todos/create-task";
import { getTaskStatus } from "~/utils/task-status";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { AppSelect } from "stories/select";
import { useNewTodo } from "~/features/todos/use-new-todo";
import { AppLoading } from "stories/loading";

type ActionData = {
  error?: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();

    const data = {
      title: String(formData.get("title")),
      content: String(formData.get("content")),
      status: getTaskStatus(formData.get("status")),
    };

    const task = await createTask(data);

    // Intentionally throw an error to test error handling UI
    // throw new Error("Test error");

    return redirect(`/todos/${task.id}`);
  } catch (error) {
    return {
      error: "Failed to create task. Please try again.",
    };
  }
};

/**
 * New task creation page.
 *
 * Renders a form with client-side validation and submits data
 * to the route action using React Router's submit API.
 */
const NewTodo = () => {
  const {
    form: {
      handleSubmit,
      control,
      formState: { errors },
      watch,
    },
    isSubmitting,
    onValid,
  } = useNewTodo();

  const actionData = useActionData<ActionData>();

  if (isSubmitting) {
    return <AppLoading />;
  }

  return (
    <>
      {actionData?.error && (
        <p className="text-red-600 text-base my-2 bg-red-100 p-2">
          {actionData.error}
        </p>
      )}
      <Form
        method="post"
        className="space-y-4"
        onSubmit={handleSubmit(onValid)}
      >
        <AppInput<CreateTaskInput>
          name="title"
          control={control}
          label="Title"
          placeholder="Enter title"
          errorText={errors.title?.message}
        />
        <AppSelect
          name="status"
          control={control}
          label="Status"
          placeholder="Select status"
          options={[
            { label: "To do", value: TASK_STATUS.TODO },
            { label: "Doing", value: TASK_STATUS.DOING },
            { label: "Done", value: TASK_STATUS.DONE },
          ]}
          errorText={errors.status?.message}
          status={watch("status")}
        />
        <AppTextarea<CreateTaskInput>
          name="content"
          control={control}
          label="Content"
          placeholder="Enter content"
          errorText={errors.content?.message}
          rows={5}
        />
        <div className="flex justify-end pt-4">
          <AppButton
            color={BUTTON_VARIANT.primary}
            type="submit"
            disabled={isSubmitting}
          >
            Save
          </AppButton>
        </div>
      </Form>
    </>
  );
};

export default NewTodo;

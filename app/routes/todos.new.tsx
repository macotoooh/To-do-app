import { redirect, type ActionFunctionArgs } from "react-router";
import { createTask } from "~/server/todos/create-task";
import { getTaskStatus } from "~/utils/task-status";
import { useNewTodo } from "~/features/todos/hooks/use-new-todo";
import { AppLoading } from "stories/loading";
import { AppToast } from "stories/toast";
import { ERROR_TOAST } from "stories/toast/constants";
import { TodoForm } from "~/features/todos/components/todo-form";

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

    return redirect(`/todos/${task.id}?created=true`);
  } catch (_error) {
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
    error,
  } = useNewTodo();

  if (isSubmitting) {
    return <AppLoading />;
  }

  return (
    <>
      {error && <AppToast variant={ERROR_TOAST}>{error}</AppToast>}
      <TodoForm
        control={control}
        titleName="title"
        statusName="status"
        contentName="content"
        errors={errors}
        onSubmit={handleSubmit(onValid)}
        isSubmitting={isSubmitting}
        statusValue={watch("status")}
      />
    </>
  );
};

export default NewTodo;

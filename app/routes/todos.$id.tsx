import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { AppLoading } from "stories/loading";
import { TodoForm } from "~/features/todos/components/todo-form";
import { useTodoDetail } from "~/features/todos/hooks/use-todo-detail";
import { getTaskById } from "~/server/todos/get-task-by-id";
import { updateTask } from "~/server/todos/update-task";
import { getTaskStatus } from "~/utils/task-status";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id;

  if (!id) {
    throw new Response("Not Found", { status: 404 });
  }

  const task = await getTaskById(id);

  if (!task) {
    throw new Response("Todo not found", { status: 404 });
  }

  return {
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();

    const data = {
      id: String(params.id),
      title: String(formData.get("title")),
      content: String(formData.get("content")),
      status: getTaskStatus(formData.get("status")),
    };

    const task = await updateTask(data);

    // Intentionally throw an error to test error handling UI
    // throw new Error("Test error");

    return redirect(`/todos/${task.id}?updated=true`);
  } catch (error) {
    return {
      error: "Failed to update task. Please try again.",
    };
  }
};

/**
 * Todo detail page for updating a task.
 *
 * Renders a TodoForm with client-side validation and
 * submits the form using React Router's submit API.
 * Displays success and error feedback based on the result.
 */
const TodoDetail = () => {
  const {
    form: {
      handleSubmit,
      control,
      formState: { errors },
      watch,
    },
    isSubmitting,
    onValid,
    showSuccess,
    actionData,
  } = useTodoDetail();

  if (isSubmitting) {
    return <AppLoading />;
  }

  return (
    <>
      {showSuccess && (
        <p className="text-green-600 text-base font-bold my-2 bg-green-100 p-2">
          {showSuccess === "created"
            ? "Todo created successfully."
            : "Update completed successfully."}
        </p>
      )}
      {actionData?.error && (
        <p className="text-red-600 text-base my-2 bg-red-100 p-2">
          {actionData.error}
        </p>
      )}
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

export default TodoDetail;

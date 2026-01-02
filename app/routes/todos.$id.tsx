import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { AppLoading } from "stories/loading";
import { ACTION_INTENT, type ActionIntent } from "~/constants/tasks";
import { TodoForm } from "~/features/todos/components/todo-form";
import { useTodoDetail } from "~/features/todos/hooks/use-todo-detail";
import { deleteTaskById } from "~/server/todos/delete-task-be-id";
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
  const formData = await request.formData();
  const intent = formData.get("intent");
  const id = params.id;

  if (!id) {
    return { error: "Invalid task id." };
  }

  if (intent !== ACTION_INTENT.UPDATE && intent !== ACTION_INTENT.DELETE) {
    return { error: "Invalid action intent." };
  }

  // Narrow form intent to a valid domain-specific ActionIntent
  const actionIntent: ActionIntent = intent;

  switch (actionIntent) {
    case ACTION_INTENT.DELETE: {
      try {
        const deleted = await deleteTaskById(id);
        if (!deleted) {
          return { error: "Task not found or already deleted." };
        }
        // Intentionally throw an error to test error handling UI
        // throw new Error("Test error");
        return redirect("/todos?deleted=true");
      } catch (error) {
        return {
          error: "Failed to delete task. Please try again.",
        };
      }
    }
    case ACTION_INTENT.UPDATE: {
      try {
        const data = {
          id,
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
    }
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
    onDelete,
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
        onDelete={onDelete}
      />
    </>
  );
};

export default TodoDetail;

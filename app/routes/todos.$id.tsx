import {
  isRouteErrorResponse,
  Link,
  redirect,
  useRouteError,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { AppLoading } from "stories/loading";
import { AppModal } from "stories/modal";
import { AppToast } from "stories/toast";
import { ERROR_TOAST, SUCCESS_TOAST } from "stories/toast/constants";
import {
  ACTION_INTENT,
  TASK_STATUS,
  type ActionIntent,
} from "~/constants/tasks";
import { AISuggestions } from "~/features/todos/components/ai-suggestions";
import { ErrorState } from "~/features/todos/components/error-state";
import { TodoForm } from "~/features/todos/components/todo-form";
import { useTodoDetail } from "~/features/todos/hooks/use-todo-detail";
import { UpdateTaskSchema } from "~/schemas/task";
import { createTask } from "~/server/todos/create-task";
import { deleteTaskById } from "~/server/todos/delete-task-by-id";
import { getTaskById } from "~/server/todos/get-task-by-id";
import { updateTask } from "~/server/todos/update-task";
import { rethrowAsInternalError } from "~/utils/errors";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id;

  if (!id) {
    throw new Response(null, {
      status: 400,
      statusText: "Task ID is required",
    });
  }

  try {
    const task = await getTaskById(id);

    if (!task) {
      throw new Response(null, {
        status: 404,
        statusText: "Todo not found",
      });
    }

    return {
      ...task,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  } catch (err) {
    rethrowAsInternalError(err);
  }
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
      } catch (_error) {
        return {
          error: "Failed to delete task. Please try again.",
        };
      }
    }
    case ACTION_INTENT.UPDATE: {
      try {
        const payload = UpdateTaskSchema.parse({
          title: formData.get("title"),
          content: formData.get("content") || undefined,
          status: formData.get("status"),
          aiSuggestions: formData.getAll("aiSuggestions"),
        });
        const data = {
          id,
          title: payload.title,
          content: payload.content,
          status: payload.status,
        };

        const task = await updateTask(data);

        for (const suggestion of payload.aiSuggestions ?? []) {
          await createTask({
            title: suggestion,
            status: TASK_STATUS.TODO,
            content: undefined,
          });
        }

        // Intentionally throw an error to test error handling UI
        // throw new Error("Test error");
        return redirect(`/todos/${task.id}?updated=true`);
      } catch (_error) {
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
    fetcher,
    id,
    isOpen,
    open,
    close,
  } = useTodoDetail();

  if (isSubmitting) {
    return <AppLoading />;
  }

  return (
    <>
      {showSuccess && (
        <AppToast variant={SUCCESS_TOAST}>
          {showSuccess === "created"
            ? "Todo created successfully."
            : "Update completed successfully."}
        </AppToast>
      )}
      {actionData?.error && (
        <AppToast variant={ERROR_TOAST}>{actionData.error}</AppToast>
      )}
      <TodoForm
        control={control}
        titleName="title"
        statusName="status"
        contentName="content"
        errors={errors}
        onSubmit={handleSubmit(onValid)}
        statusValue={watch("status")}
      >
        <div className="flex gap-x-2 justify-end pt-4">
          <AppButton
            type="button"
            color={BUTTON_VARIANT.outline}
            disabled={!watch("title")}
            onClick={async () => {
              await fetcher.submit(
                { title: watch("title") },
                { method: "post", action: `/todos/${id}/suggest-ai` },
              );
            }}
          >
            🤖 Generate task ideas with AI
          </AppButton>
          <AppButton
            type="button"
            color={BUTTON_VARIANT.danger}
            onClick={() => open()}
            testId="open-delete-modal"
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
      </TodoForm>
      {/* TODO: After clicking Save, hide AISuggestions when the save succeeds */}
      {/* TODO: Review and refine the toast message shown after saving */}
      <AISuggestions control={control} name="aiSuggestions" fetcher={fetcher} />

      {isOpen && (
        <AppModal
          title="Delete this item?"
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={async () => {
            await onDelete();
          }}
          onCancel={() => {
            close();
          }}
        />
      )}
    </>
  );
};

export default TodoDetail;

export const ErrorBoundary = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <ErrorState
        status={error.status}
        title={error.statusText}
        action={<Link to="/todos">Back to list</Link>}
      />
    );
  }

  return <ErrorState />;
};

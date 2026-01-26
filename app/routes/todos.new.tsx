import { redirect, type ActionFunctionArgs } from "react-router";
import { createTask } from "~/server/todos/create-task";
import { getTaskStatus } from "~/utils/task-status";
import { useNewTodo } from "~/features/todos/hooks/use-new-todo";
import { AppLoading } from "stories/loading";
import { AppToast } from "stories/toast";
import { ERROR_TOAST } from "stories/toast/constants";
import { TodoForm } from "~/features/todos/components/todo-form";
import { CreateTaskSchema } from "~/schemas/task";
import { TASK_STATUS } from "~/constants/tasks";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { AISuggestions } from "~/features/todos/components/ai-suggestions";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();

    const payload = CreateTaskSchema.parse({
      title: formData.get("title"),
      content: formData.get("content") || undefined,
      status: getTaskStatus(formData.get("status")),
      aiSuggestions: formData.getAll("aiSuggestions"),
    });
    const task = await createTask({
      title: payload.title,
      content: payload.content ?? undefined,
      status: payload.status,
    });

    for (const suggestion of payload.aiSuggestions ?? []) {
      await createTask({
        title: suggestion,
        status: TASK_STATUS.TODO,
        content: undefined,
      });
    }

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
    fetcher,
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
                { method: "post", action: "suggest-ai" },
              );
            }}
          >
            🤖 Generate task ideas with AI
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

      <AISuggestions control={control} name="aiSuggestions" fetcher={fetcher} />
    </>
  );
};

export default NewTodo;

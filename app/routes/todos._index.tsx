import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { AppStatusLabel } from "stories/status-label";
import { AppSummaryCard } from "stories/summary-card";
import { SUMMARY_CARD_VARIANT } from "stories/summary-card/constants";
import { AppToast } from "stories/toast";
import { SUCCESS_TOAST } from "stories/toast/constants";
import { TASK_STATUS } from "~/constants/tasks";
import { useTodosIndex } from "~/features/todos/hooks/use-todos-index";
import { formatDate } from "~/utils/format-date";
import { getTaskList } from "~/server/todos/get-task-list";
import { rethrowAsInternalError } from "~/utils/errors";
import { ErrorState } from "~/features/todos/components/error-state";

export const loader = async () => {
  try {
    const tasks = await getTaskList();

    if (!Array.isArray(tasks)) {
      throw new Error("Invalid task list format");
    }

    return tasks.map((task) => ({
      ...task,
      createdAt: formatDate(task.createdAt),
      updatedAt: formatDate(task.updatedAt),
    }));
  } catch (error) {
    console.error("Failed to load tasks:", error);
    rethrowAsInternalError(error);
  }
};

/**
 * Todos index page component.
 *
 * Displays a list of todos using tasks loaded from the `/todos` route loader.
 */
export const TodosIndex = () => {
  const { tasks, showDeletedToast } = useTodosIndex();
  if (!tasks) return null;

  const summary = tasks.reduce(
    (acc, task) => {
      acc.total += 1;
      if (task.status === TASK_STATUS.TODO) acc.todo += 1;
      if (task.status === TASK_STATUS.DOING) acc.doing += 1;
      if (task.status === TASK_STATUS.DONE) acc.done += 1;
      return acc;
    },
    { total: 0, todo: 0, doing: 0, done: 0 },
  );

  return (
    <>
      {showDeletedToast && (
        <AppToast variant={SUCCESS_TOAST}>Todo deleted successfully.</AppToast>
      )}

      <section className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <AppSummaryCard label="All tasks" value={summary.total} />
        <AppSummaryCard
          label="To do"
          value={summary.todo}
          variant={SUMMARY_CARD_VARIANT.todo}
        />
        <AppSummaryCard
          label="Doing"
          value={summary.doing}
          variant={SUMMARY_CARD_VARIANT.doing}
        />
        <AppSummaryCard
          label="Done"
          value={summary.done}
          variant={SUMMARY_CARD_VARIANT.done}
        />
      </section>

      {tasks.length === 0 ? (
        <section className="mt-4 rounded-md border border-dashed border-form-border bg-card-bg p-8 text-center">
          <p className="mb-2 text-lg font-bold">No tasks yet</p>
          <p className="mb-4 text-sm text-gray-500">
            Create your first task to start organizing your work.
          </p>
          <Link to="/todos/new">
            <AppButton color={BUTTON_VARIANT.new}>
              Create your first task
            </AppButton>
          </Link>
        </section>
      ) : (
        <>
          <div className="mt-4 hidden gap-5 px-2 font-semibold lg:grid lg:grid-cols-3">
            <div className="p-2">Title</div>
            <div className="p-2">Status</div>
            <div className="p-2">Created At</div>
          </div>

          <div className="mt-2 space-y-2 overflow-y-auto rounded-md bg-surface-bg p-4 lg:max-h-200">
            {tasks.map((task) => (
              <Link
                key={task.id}
                to={`/todos/${task.id}`}
                className="grid grid-cols-1 gap-2 rounded-md bg-card-bg p-3 transition-colors duration-200 hover:bg-[#e0dcdc] lg:grid-cols-3"
              >
                <div
                  className="rounded-md bg-surface-bg p-2 font-bold wrap-break-word"
                  data-testid={`title-${task.id}`}
                >
                  {task.title}
                </div>
                <div
                  className="flex items-center rounded-md bg-surface-bg p-2"
                  data-testid={`status-${task.id}`}
                >
                  <AppStatusLabel status={task.status} />
                </div>
                <div
                  className="rounded-md bg-surface-bg p-2 text-sm"
                  data-testid={`createdAt-${task.id}`}
                >
                  {task.createdAt}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default TodosIndex;

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

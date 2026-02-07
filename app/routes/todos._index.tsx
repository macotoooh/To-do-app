import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { AppFilterSelect } from "stories/filter-select";
import { AppSummaryCard } from "stories/summary-card";
import { SUMMARY_CARD_VARIANT } from "stories/summary-card/constants";
import { AppToast } from "stories/toast";
import { SUCCESS_TOAST } from "stories/toast/constants";
import { TASK_STATUS } from "~/constants/tasks";
import { TodosListContent } from "~/features/todos/components/todos-list-content";
import { useTodosIndex } from "~/features/todos/hooks/use-todos-index";
import { formatDate } from "~/utils/format-date";
import { getTaskList } from "~/server/todos/get-task-list";
import { rethrowAsInternalError } from "~/utils/errors";
import { ErrorState } from "~/features/todos/components/error-state";
import { isTaskStatus } from "~/utils/task-status";

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
  const {
    tasks,
    showDeletedToast,
    filteredTasks,
    activeStatus,
    keyword,
    activeSort,
    sortOption,
    handleFilterChange,
    handleKeywordChange,
    handleSortChange,
    handleClearAllFilters,
  } = useTodosIndex();

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
        <AppSummaryCard
          label="All tasks"
          value={summary.total}
          isActive={!activeStatus}
          onClick={() => handleFilterChange(null)}
        />
        <AppSummaryCard
          label="To do"
          value={summary.todo}
          variant={SUMMARY_CARD_VARIANT.todo}
          isActive={activeStatus === TASK_STATUS.TODO}
          onClick={() => handleFilterChange(TASK_STATUS.TODO)}
        />
        <AppSummaryCard
          label="Doing"
          value={summary.doing}
          variant={SUMMARY_CARD_VARIANT.doing}
          isActive={activeStatus === TASK_STATUS.DOING}
          onClick={() => handleFilterChange(TASK_STATUS.DOING)}
        />
        <AppSummaryCard
          label="Done"
          value={summary.done}
          variant={SUMMARY_CARD_VARIANT.done}
          isActive={activeStatus === TASK_STATUS.DONE}
          onClick={() => handleFilterChange(TASK_STATUS.DONE)}
        />
      </section>
      <section className="mt-3 grid gap-3 rounded-md bg-surface-bg p-3 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-500" htmlFor="task-search">
            Search
          </label>
          <input
            id="task-search"
            value={keyword}
            onChange={(event) => {
              handleKeywordChange(event.target.value);
            }}
            placeholder="Search title or content"
            className="h-10 w-full rounded-md border border-form-border bg-white px-3 text-sm"
          />
        </div>
        <div className="space-y-1">
          <AppFilterSelect
            id="task-status-filter"
            label="Status filter"
            value={activeStatus ?? ""}
            onChange={(value) => {
              handleFilterChange(isTaskStatus(value) ? value : null);
            }}
            options={[
              { label: "All", value: "" },
              { label: "To do", value: TASK_STATUS.TODO },
              { label: "Doing", value: TASK_STATUS.DOING },
              { label: "Done", value: TASK_STATUS.DONE },
            ]}
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-end gap-2">
            <div className="w-full">
              <AppFilterSelect
                id="task-sort"
                label="Sort"
                value={activeSort}
                onChange={handleSortChange}
                options={[
                  { label: "Newest first", value: sortOption.CREATED_DESC },
                  { label: "Oldest first", value: sortOption.CREATED_ASC },
                  { label: "Title A-Z", value: sortOption.TITLE_ASC },
                  { label: "Title Z-A", value: sortOption.TITLE_DESC },
                ]}
              />
            </div>
            <AppButton
              type="button"
              color={BUTTON_VARIANT.outline}
              onClick={handleClearAllFilters}
            >
              Clear
            </AppButton>
          </div>
        </div>
      </section>
      <TodosListContent
        tasks={tasks}
        filteredTasks={filteredTasks}
        onClearFilters={handleClearAllFilters}
      />
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

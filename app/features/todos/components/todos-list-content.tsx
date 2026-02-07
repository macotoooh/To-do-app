import { Link } from "react-router";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { AppStatusLabel } from "stories/status-label";
import type { TaskDTO } from "~/types/tasks";

type TodosListContentProps = {
  tasks: TaskDTO[];
  filteredTasks: TaskDTO[];
  onClearFilters: () => void;
};

/**
 * Renders todos list area with empty/filter-empty/default states.
 *
 * @param tasks - Full task list from loader
 * @param filteredTasks - Task list after applying filters
 * @param onClearFilters - Callback to reset active filters
 */
export const TodosListContent = ({
  tasks,
  filteredTasks,
  onClearFilters,
}: TodosListContentProps) => {
  if (tasks.length === 0) {
    return (
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
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <section className="mt-4 rounded-md border border-dashed border-form-border bg-card-bg p-8 text-center">
        <p className="mb-2 text-lg font-bold">No tasks match your filters</p>
        <p className="mb-4 text-sm text-gray-500">
          Try changing search keywords, status, or sort settings.
        </p>
        <AppButton
          type="button"
          color={BUTTON_VARIANT.outline}
          onClick={onClearFilters}
        >
          Clear filters
        </AppButton>
      </section>
    );
  }

  return (
    <section className="mt-4 overflow-hidden rounded-md border border-gray-200 bg-surface-bg">
      <div className="hidden grid-cols-3 gap-5 border-b border-gray-200 bg-card-bg px-4 py-2 text-sm font-semibold tracking-wide text-gray-500 uppercase lg:grid">
        <div className="p-1">Title</div>
        <div className="p-1">Status</div>
        <div className="p-1">Created At</div>
      </div>

      <div className="space-y-2 overflow-y-auto p-4 lg:max-h-200">
        {filteredTasks.map((task) => (
          <Link
            key={task.id}
            to={`/todos/${task.id}`}
            className="grid grid-cols-1 gap-2 rounded-md border border-transparent bg-card-bg p-3 transition-colors duration-200 hover:border-gray-200 hover:bg-[#e0dcdc] lg:grid-cols-3"
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
    </section>
  );
};

import { Link } from "react-router";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { AppModal } from "stories/modal";
import { AppStatusLabel } from "stories/status-label";
import { useTodosListContent } from "~/features/todos/hooks/use-todos-list-content";
import type { TaskDTO } from "~/types/tasks";

type TodosListContentProps = {
  tasks: TaskDTO[];
  filteredTasks: TaskDTO[];
  onClearFilters: () => void;
  aiPriorities: Record<string, { score: number; reason: string }>;
};

/**
 * Renders todos list area with empty/filter-empty/default states.
 *
 * @param tasks - Full task list from loader
 * @param filteredTasks - Task list after applying filters
 * @param onClearFilters - Callback to reset active filters
 * @param aiPriorities - AI-generated priority scores/reasons keyed by task id
 */
export const TodosListContent = ({
  tasks,
  filteredTasks,
  onClearFilters,
  aiPriorities,
}: TodosListContentProps) => {
  const {
    selectedTask,
    slideToDetail,
    slideToList,
    openTaskPreview,
    closeTaskPreview,
    openSelectedTaskDetail,
  } = useTodosListContent();

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
    <section className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-surface-bg shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 bg-card-bg px-4 py-3 text-xs text-gray-500 sm:text-sm">
        <p aria-live="polite">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
      </div>
      <div className="hidden grid-cols-3 gap-5 border-b border-gray-200 bg-card-bg px-4 py-2 text-sm font-semibold tracking-wide text-gray-500 uppercase lg:grid">
        <div className="p-1">Title</div>
        <div className="p-1">Status</div>
        <div className="p-1">Created At</div>
      </div>

      <div className="space-y-2 overflow-y-auto p-3 lg:max-h-200 lg:p-3">
        {filteredTasks.map((task) => (
          <article
            key={task.id}
            className="rounded-lg border border-gray-200/70 bg-card-bg p-2.5 transition-all duration-200 hover:border-gray-300 hover:shadow-sm lg:p-2"
          >
            <div className="overflow-x-auto snap-x snap-mandatory rounded-md lg:hidden">
              <div className="flex w-full items-start gap-2">
                <button
                  type="button"
                  onClick={slideToDetail}
                  className="w-full shrink-0 snap-start rounded-md text-left focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 lg:gap-1.5">
                    <div className="rounded-md bg-surface-bg p-2.5 font-bold wrap-break-word lg:p-2">
                      {task.title}
                    </div>
                    <div className="flex items-center rounded-md bg-surface-bg p-2.5 lg:p-2">
                      <AppStatusLabel status={task.status} />
                    </div>
                    <div className="rounded-md bg-surface-bg p-2.5 text-sm lg:p-2">
                      {task.createdAt}
                    </div>
                  </div>
                </button>

                <section className="w-full shrink-0 snap-start rounded-md border border-gray-200 bg-surface-bg p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Task details
                    </p>
                    <button
                      type="button"
                      onClick={slideToList}
                      className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-100"
                    >
                      Back to list
                    </button>
                  </div>
                  <p className="mb-2 font-bold wrap-break-word">{task.title}</p>
                  <p className="mb-3 text-sm wrap-break-word">
                    {task.content?.trim() ? task.content : "No content"}
                  </p>
                  <div className="mb-2">
                    <AppStatusLabel status={task.status} />
                  </div>
                  <p className="text-xs text-gray-500">{task.createdAt}</p>
                </section>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openTaskPreview(task)}
              className="hidden w-full rounded-md text-left focus:outline-none focus:ring-2 focus:ring-gray-300 lg:block"
            >
              <div className="grid grid-cols-3 gap-1.5">
                <div
                  className="rounded-md bg-surface-bg p-2 font-bold wrap-break-word"
                  data-testid={`title-${task.id}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{task.title}</span>
                    {typeof aiPriorities[task.id]?.score === "number" && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        AI {aiPriorities[task.id].score}
                      </span>
                    )}
                  </div>
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
              </div>
            </button>

            <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-gray-100 pt-1.5">
              <p className="text-xs text-gray-500 lg:hidden">
                Click row to preview details
              </p>
              <Link
                to={`/todos/${task.id}`}
                aria-label={`View details for ${task.title}`}
                className="ml-auto inline-flex items-center rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              >
                Details
              </Link>
            </div>
          </article>
        ))}
      </div>

      {selectedTask && (
        <div className="hidden lg:block">
          <AppModal
            title="Task preview"
            confirmLabel="Open details"
            cancelLabel="Close"
            confirmColor={BUTTON_VARIANT.primary}
            cancelColor={BUTTON_VARIANT.neutral}
            onConfirm={() => {
              openSelectedTaskDetail();
            }}
            onCancel={closeTaskPreview}
            allowEscapeClose
            allowOverlayClose
            panelClassName="w-[min(720px,92vw)]"
          >
            <div className="space-y-3">
              <div className="rounded-md bg-surface-bg p-3">
                <p className="text-xs text-gray-500">Title</p>
                <p className="mt-1 font-bold wrap-break-word">
                  {selectedTask.title}
                </p>
              </div>
              <div className="rounded-md bg-surface-bg p-3">
                <p className="text-xs text-gray-500">Content</p>
                <p className="mt-1 text-sm wrap-break-word">
                  {selectedTask.content?.trim()
                    ? selectedTask.content
                    : "No content"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md bg-surface-bg p-3">
                  <p className="mb-1 text-xs text-gray-500">Status</p>
                  <AppStatusLabel status={selectedTask.status} />
                </div>
                <div className="rounded-md bg-surface-bg p-3">
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="mt-1 text-sm">{selectedTask.createdAt}</p>
                </div>
              </div>
              {typeof aiPriorities[selectedTask.id]?.score === "number" && (
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                  <p className="text-xs text-blue-700">AI Priority Score</p>
                  <div className="mt-1">
                    <AppStatusLabel
                      status={`AI ${aiPriorities[selectedTask.id].score}`}
                      tone="ai"
                    />
                  </div>
                  <p className="mt-1 text-sm text-blue-800">
                    {aiPriorities[selectedTask.id].reason}
                  </p>
                </div>
              )}
            </div>
          </AppModal>
        </div>
      )}
    </section>
  );
};

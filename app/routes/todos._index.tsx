import { Link } from "react-router";
import { AppStatusLabel } from "stories/status-label";
import { AppToast } from "stories/toast";
import { SUCCESS_TOAST } from "stories/toast/constants";
import { useTodosIndex } from "~/features/todos/hooks/use-todos-index";
import { formatDate } from "~/utils/format-date";
import { getTaskList } from "~/server/todos/get-task-list";

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
    throw new Response("Could not load tasks", {
      status: 500,
      statusText: "Internal Server Error",
    });
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

  return (
    <>
      {showDeletedToast && (
        <AppToast variant={SUCCESS_TOAST}>Todo deleted successfully.</AppToast>
      )}

      <div className="hidden lg:grid lg:grid-cols-3 gap-5 px-2 font-semibold bg-surface-bg sticky top-15 z-10">
        <div className="p-2">Title</div>
        <div className="p-2">Status</div>
        <div className="p-2">Created At</div>
      </div>

      <div className="mt-2 p-5 bg-surface-bg rounded-md space-y-2 overflow-y-auto lg:max-h-200">
        {tasks.map((task) => (
          <Link
            key={task.id}
            to={`/todos/${task.id}`}
            className="grid lg:grid-cols-3 grid-cols-1 gap-2 p-2 bg-card-bg hover:bg-[#e0dcdc] transition-colors duration-200 rounded-md"
          >
            <div className="p-2 bg-surface-bg font-bold">{task.title}</div>
            <div className="p-2 bg-surface-bg">
              <AppStatusLabel status={task.status} />
            </div>
            <div className="p-2 bg-surface-bg">{task.createdAt}</div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default TodosIndex;

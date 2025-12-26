import { Link, useRouteLoaderData } from "react-router";
import { AppStatusLabel } from "stories/status-label";
import type { TaskDTO } from "~/types/tasks";
import { formatDate } from "~/utils/format-date";

/**
 * Todos index page component.
 *
 * Displays a list of todos using tasks loaded from the `/todos` route loader.
 */
export const TodosIndex = () => {
  const tasks = useRouteLoaderData<TaskDTO[]>("routes/todos");
  if (!tasks) return null;

  return (
    <div className="mt-2 p-5 bg-[#EEE8E8] hover:opacity-90">
      {tasks.map((task) => (
        <Link
          key={task.id}
          to={`/todos/${task.id}`}
          className="grid grid-cols-3 gap-5 p-2 bg-[#F4EFEF] hover:bg-[#e0dcdc] transition-colors duration-200 rounded-md"
        >
          <div className="p-2 bg-[#EEE8E8] font-bold">{task.title}</div>
          <div className="p-2 bg-[#EEE8E8]">
            <AppStatusLabel status={task.status} />
          </div>
          <div className="p-2 bg-[#EEE8E8]">{formatDate(task.createdAt)}</div>
        </Link>
      ))}
    </div>
  );
};

export default TodosIndex;

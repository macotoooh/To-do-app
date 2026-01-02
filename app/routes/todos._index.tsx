import { Link } from "react-router";
import { AppStatusLabel } from "stories/status-label";
import { AppToast } from "stories/toast";
import { SUCCESS_TOAST } from "stories/toast/constants";
import { useTodosIndex } from "~/features/todos/hooks/use-todos-index";
import { formatDate } from "~/utils/format-date";

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
    </>
  );
};

export default TodosIndex;

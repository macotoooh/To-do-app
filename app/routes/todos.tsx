import { Outlet } from "react-router";
import { getTaskList } from "~/server/todos/get-task-list";
import type { TaskDTO } from "~/types/tasks";

export const loader = async (): Promise<TaskDTO[]> => {
  const tasks = await getTaskList();
  return tasks.map((task) => ({
    ...task,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  }));
};

/**
 * Layout component for the `/todos` route.
 *
 * Provides a common layout for all nested todo pages.
 */
export const TodosLayout = () => {
  return (
    <div className="w-full p-5">
      <h1 className="font-bold text-3xl">Todos</h1>
      <Outlet />
    </div>
  );
};

export default TodosLayout;

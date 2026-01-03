import { Link, Outlet } from "react-router";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { useTodoLayout } from "~/features/todos/hooks/use-todos-layout";
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
  const { isNewPage, isTodoListPage, headerTitle } = useTodoLayout();

  return (
    <div className="w-full p-5">
      <div className="sticky top-0 flex justify-between p-2 bg-white">
        <div className="flex items-center">
          {!isTodoListPage && (
            <Link
              to="/todos"
              className="text-2xl font-bold hover:opacity-90 pr-2"
              aria-label="Back to Todos"
            >
              〈
            </Link>
          )}
          <h1 className="font-bold text-3xl">{headerTitle}</h1>
        </div>
        {!isNewPage && (
          <Link to="/todos/new">
            <AppButton color={BUTTON_VARIANT.new}>New task</AppButton>
          </Link>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default TodosLayout;

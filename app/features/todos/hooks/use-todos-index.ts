import { useEffect, useState } from "react";
import { useNavigate, useRouteLoaderData, useSearchParams } from "react-router";
import type { TaskDTO } from "~/types/tasks";

/**
 * Custom hook for the Todos index page.
 *
 * Loads tasks and handles toast visibility when a task is deleted.
 *
 * @returns Tasks and success state
 */
export const useTodosIndex = () => {
  const tasks = useRouteLoaderData<TaskDTO[]>("routes/todos");
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [showDeletedToast, setShowDeletedToast] = useState(false);

  const deleted = params.get("deleted") === "true";

  useEffect(() => {
    if (!deleted) return;

    setShowDeletedToast(!showDeletedToast);

    const timer = setTimeout(() => {
      setShowDeletedToast(false);
      navigate(".", { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [deleted, navigate]);

  return { tasks, showDeletedToast };
};

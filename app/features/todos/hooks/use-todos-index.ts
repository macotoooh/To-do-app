import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import type { TaskDTO, TaskStatus } from "~/types/tasks";
import { isTaskStatus } from "~/utils/task-status";

/**
 * Custom hook for the Todos index page.
 *
 * Loads tasks and handles toast visibility when a task is deleted.
 *
 * @returns Tasks and success state
 */
export const useTodosIndex = () => {
  const tasks = useLoaderData() as TaskDTO[];
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const [showDeletedToast, setShowDeletedToast] = useState(false);

  const deleted = params.get("deleted") === "true";
  const statusParam = params.get("status");
  const activeStatus = isTaskStatus(statusParam) ? statusParam : null;

  const filteredTasks = activeStatus
    ? tasks.filter((task) => task.status === activeStatus)
    : tasks;

  /**
   * Updates the current status filter in the URL query.
   *
   * Sets `?status=<TaskStatus>` when a status is selected,
   * or removes the query parameter to show all tasks.
   *
   * @param status Selected task status filter, or null to clear filtering
   */
  const handleFilterChange = (status: TaskStatus | null) => {
    const nextParams = new URLSearchParams(params);
    if (status) {
      nextParams.set("status", status);
    } else {
      nextParams.delete("status");
    }
    setParams(nextParams);
  };

  useEffect(() => {
    if (!deleted) return;

    setShowDeletedToast(true);

    const timer = setTimeout(async () => {
      setShowDeletedToast(false);
      await navigate(".", { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [deleted, navigate]);

  return {
    tasks,
    showDeletedToast,
    filteredTasks,
    activeStatus,
    handleFilterChange,
  };
};

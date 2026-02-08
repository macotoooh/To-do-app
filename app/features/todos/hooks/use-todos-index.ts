import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router";
import { SORT_OPTION } from "~/constants/sort";
import type { TaskDTO, TaskStatus } from "~/types/tasks";
import { isSortOption } from "~/utils/sort";
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
  const keyword = params.get("q") ?? "";
  const sortParam = params.get("sort");
  const activeStatus = isTaskStatus(statusParam) ? statusParam : null;
  const activeSort = isSortOption(sortParam)
    ? sortParam
    : SORT_OPTION.CREATED_DESC;

  const statusFilteredTasks = activeStatus
    ? tasks.filter((task) => task.status === activeStatus)
    : tasks;
  const searchedTasks = statusFilteredTasks.filter((task) => {
    if (!keyword.trim()) return true;
    const normalizedKeyword = keyword.trim().toLowerCase();
    return (
      task.title.toLowerCase().includes(normalizedKeyword) ||
      task.content?.toLowerCase().includes(normalizedKeyword)
    );
  });
  const filteredTasks = [...searchedTasks].sort((a, b) => {
    if (activeSort === SORT_OPTION.CREATED_ASC) {
      return a.createdAt.localeCompare(b.createdAt);
    }
    if (activeSort === SORT_OPTION.TITLE_ASC) {
      return a.title.localeCompare(b.title);
    }
    if (activeSort === SORT_OPTION.TITLE_DESC) {
      return b.title.localeCompare(a.title);
    }
    return b.createdAt.localeCompare(a.createdAt);
  });

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
      setParams(nextParams);
      return;
    }

    nextParams.delete("status");
    setParams(nextParams);
  };

  /**
   * Updates the search keyword in the URL query.
   *
   * @param value Keyword used to search title/content, or empty string to clear
   */
  const handleKeywordChange = (value: string) => {
    const nextParams = new URLSearchParams(params);
    if (value.trim()) {
      nextParams.set("q", value);
      setParams(nextParams);
      return;
    }

    nextParams.delete("q");
    setParams(nextParams);
  };

  /**
   * Updates the current sort order in the URL query.
   *
   * Ignores invalid values and keeps the current sort.
   *
   * @param sort Sort option value from the UI
   */
  const handleSortChange = (sort: string) => {
    if (!isSortOption(sort)) return;
    const nextParams = new URLSearchParams(params);
    nextParams.set("sort", sort);
    setParams(nextParams);
  };

  /**
   * Clears all active list controls (search, status, and sort).
   *
   * Keeps `deleted=true` when present so the delete success toast flow works.
   */
  const handleClearAllFilters = () => {
    const nextParams = new URLSearchParams();
    if (params.get("deleted") === "true") {
      nextParams.set("deleted", "true");
    }
    nextParams.delete("q");
    nextParams.delete("status");
    nextParams.delete("sort");
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
    keyword,
    activeSort,
    sortOption: SORT_OPTION,
    handleFilterChange,
    handleKeywordChange,
    handleSortChange,
    handleClearAllFilters,
  };
};

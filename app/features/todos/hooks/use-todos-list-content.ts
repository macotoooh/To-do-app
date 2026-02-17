import { useState, type MouseEvent } from "react";
import { useNavigate } from "react-router";
import type { TaskDTO } from "~/types/tasks";

/**
 * Hook for todos list content interactions.
 *
 * Encapsulates preview modal state, mobile slide interactions,
 * and navigation to the detail page from the selected task.
 *
 * @returns State and handlers used by the todos list content component
 */
export const useTodosListContent = () => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<TaskDTO | null>(null);

  /**
   * Slides a mobile list row to its detail side.
   *
   * @param event Click event from the row button
   */
  const slideToDetail = (event: MouseEvent<HTMLButtonElement>) => {
    const slider = event.currentTarget.parentElement;
    if (!slider) return;
    slider.scrollTo({ left: slider.clientWidth, behavior: "smooth" });
  };

  /**
   * Slides a mobile list row back to its summary side.
   *
   * @param event Click event from the "Back to list" button
   */
  const slideToList = (event: MouseEvent<HTMLButtonElement>) => {
    const slider = event.currentTarget.parentElement;
    if (!slider) return;
    slider.scrollTo({ left: 0, behavior: "smooth" });
  };

  /**
   * Opens the desktop preview modal for a task.
   *
   * @param task Task selected from the list
   */
  const openTaskPreview = (task: TaskDTO) => {
    setSelectedTask(task);
  };

  /**
   * Closes the desktop preview modal.
   */
  const closeTaskPreview = () => {
    setSelectedTask(null);
  };

  /**
   * Navigates to the selected task detail page and closes preview state.
   */
  const openSelectedTaskDetail = () => {
    if (!selectedTask) return;
    setSelectedTask(null);
    void navigate(`/todos/${selectedTask.id}`);
  };

  return {
    selectedTask,
    slideToDetail,
    slideToList,
    openTaskPreview,
    closeTaskPreview,
    openSelectedTaskDetail,
  };
};

import { useMatch } from "react-router";

/**
 * Hook for the `/todos` layout.
 *
 * Determines the current todo page type and provides
 * a corresponding header title based on the active route.
 *
 * @returns An object containing page match flags and a header title string
 */
export const useTodoLayout = () => {
  const isNewPage = !!useMatch("/todos/new");
  const isTodoListPage = !!useMatch("/todos");

  /**
   * Returns the header title based on the current route.
   *
   * - "Create todo" for the new todo page
   * - "Todos" for the todo list page
   *
   * @returns Header title for the todo layout
   */
  const getHeaderTitle = () => {
    if (isNewPage) return "Create todo";
    if (isTodoListPage) return "Todos";
    return "";
  };

  return { isNewPage, isTodoListPage, headerTitle: getHeaderTitle() };
};

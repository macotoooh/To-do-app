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

  return { isNewPage, isTodoListPage };
};

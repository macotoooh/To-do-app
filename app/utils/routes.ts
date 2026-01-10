import { PATH, ROUTE } from "~/constants/routes";

/**
 * Returns the screen title to display in the header based on the given pathname.
 *
 * @param pathname - The current URL path of the screen.
 * @returns The corresponding title to display in the header.
 */
export const getHeaderTitle = (pathname: string): string => {
  switch (pathname) {
    case PATH.TODO.LIST:
      return ROUTE.TODO_LIST;
    case PATH.TODO.CREATE:
      return ROUTE.CREATE_TODO;
    default:
      if (pathname.startsWith("/todos/")) {
        return ROUTE.TODO_DETAIL;
      }
      return "";
  }
};

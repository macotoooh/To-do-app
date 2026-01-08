import { ROUTE, ROUTE_TITLE_MAP } from "~/constants/routes";

/**
 * Returns the screen title to display in the header based on the given pathname.
 *
 * @param pathname - The current URL path of the screen.
 * @returns The corresponding title to display in the header.
 */
export const getHeaderTitle = (pathname: string) => {
  if (ROUTE_TITLE_MAP[pathname]) return ROUTE_TITLE_MAP[pathname];
  if (pathname.startsWith("/todos/")) return ROUTE.TODO_DETAIL;
  return "";
};

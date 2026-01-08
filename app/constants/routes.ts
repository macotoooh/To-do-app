import type { RouteValue, ValidTodoPaths } from "~/types/tasks";

export const ROUTE = {
  TODO_LIST: "Todos",
  TODO_DETAIL: "Todos Detail",
  CREATE_TODO: "Create todo",
} as const;

export const PATH = {
  TODO: {
    LIST: "/todos",
    CREATE: "/todos/new",
    DETAIL: (id: string | number) => `/todos/${id}`,
  },
} as const;


export const ROUTE_TITLE_MAP: Record<ValidTodoPaths, RouteValue> = {
  [PATH.TODO.LIST]: ROUTE.TODO_LIST,
  [PATH.TODO.CREATE]: ROUTE.CREATE_TODO,
};

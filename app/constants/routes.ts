import type { RouteValue } from "~/types/tasks";

export const ROUTE = {
  TODO_LIST: "Todos",
  TODO_DETAIL: "Todos Detail",
  CREATE_TODO: "Create todo",
} as const;

export const ROUTE_TITLE_MAP: Record<string, RouteValue> = {
  "/todos": ROUTE.TODO_LIST,
  "/todos/new": ROUTE.CREATE_TODO,
} as const;

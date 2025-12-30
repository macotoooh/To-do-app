import { route, index, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("todos", "routes/todos.tsx", [
    index("routes/todos._index.tsx"),
    route("new", "routes/todos.new.tsx"),
    route(":id", "routes/todos.$id.tsx"),
  ]),
] satisfies RouteConfig;

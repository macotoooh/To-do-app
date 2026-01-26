import { route, index, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("todos", "routes/todos.tsx", [
    index("routes/todos._index.tsx"),
    route("new", "routes/todos.new.tsx"),
    route(":id", "routes/todos.$id.tsx"),
    route("new/suggest-ai", "routes/todos.new.suggest-ai.tsx"),
    route(":id/suggest-ai", "routes/todos.$id.suggest-ai.tsx"),
  ]),
] satisfies RouteConfig;

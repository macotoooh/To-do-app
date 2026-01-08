import { Outlet, useLoaderData, Link } from "react-router-dom";
import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import { useTodoLayout } from "~/features/todos/hooks/use-todos-layout";
import type { LoaderFunctionArgs } from "react-router";

const ROUTE_TITLE_MAP: Record<string, string> = {
  "/todos": "Todos",
  "/todos/new": "Create todo",
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const headerTitle =
    ROUTE_TITLE_MAP[pathname] ??
    (pathname.startsWith("/todos/") ? "Todo Detail" : "");

  return { headerTitle };
};

export const TodosLayout = () => {
  const { isNewPage, isTodoListPage } = useTodoLayout();
  const { headerTitle } = useLoaderData<typeof loader>();

  return (
    <div className="w-full p-5">
      <div className="sticky top-0 flex justify-between p-2 bg-white">
        <div className="flex items-center">
          {!isTodoListPage && (
            <Link
              to="/todos"
              className="text-2xl font-bold hover:opacity-90 pr-2"
              aria-label="Back to Todos"
            >
              〈
            </Link>
          )}
          <h1 className="font-bold text-3xl">{headerTitle}</h1>
        </div>
        {!isNewPage && (
          <Link to="/todos/new">
            <AppButton color={BUTTON_VARIANT.new}>New task</AppButton>
          </Link>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default TodosLayout;

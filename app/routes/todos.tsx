import { AppButton } from "stories/button";
import { BUTTON_VARIANT } from "stories/button/constants";
import {
  Link,
  Outlet,
  useLoaderData,
  type LoaderFunctionArgs,
} from "react-router";
import { getHeaderTitle } from "~/utils/route-labels";
import { PATH } from "~/constants/routes";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  return {
    headerTitle: getHeaderTitle(pathname),
    isTodoListPage: pathname === PATH.TODO.LIST,
    isCreatePage: pathname === PATH.TODO.CREATE,
  };
};

export const TodosLayout = () => {
  const { headerTitle, isCreatePage, isTodoListPage } =
    useLoaderData<typeof loader>();

  return (
    <div className="w-full p-5">
      <div className="sticky top-0 z-20 mb-4 flex items-center justify-between border-b border-gray-200 bg-white/95 p-2 backdrop-blur-sm">
        <div className="flex items-center">
          {!isTodoListPage && (
            <Link
              to="/todos"
              className="pr-2 text-2xl font-bold hover:opacity-50"
              aria-label="Back to Todos"
            >
              〈
            </Link>
          )}
          <h1 className="font-bold text-3xl">{headerTitle}</h1>
        </div>
        {!isCreatePage && (
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

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
      <div className="sticky top-0 flex justify-between p-2 bg-white">
        <div className="flex items-center">
          {!isTodoListPage && (
            <Link
              to="/todos"
              className="text-2xl font-bold hover:opacity-50 pr-2"
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

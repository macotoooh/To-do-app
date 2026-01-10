import { describe, test, vi, beforeEach, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { loader } from "./todos";
import TodosLayout from "./todos";
import { createLoaderArgs } from "~/utils/test-router-args";
import { ROUTE } from "~/constants/routes";
import { createMemoryRouter, RouterProvider } from "react-router";

describe("TodosLayout loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("TodosLayout loader - headerTitle + isTodoListPage + isCreatePage", () => {
    test.each([
      {
        input: new Request("http://localhost/todos"),
        expected: {
          headerTitle: ROUTE.TODO_LIST,
          isTodoListPage: true,
          isCreatePage: false,
        },
      },
      {
        input: new Request("http://localhost/todos/new"),
        expected: {
          headerTitle: ROUTE.CREATE_TODO,
          isTodoListPage: false,
          isCreatePage: true,
        },
      },
      {
        input: new Request("http://localhost/todos/1"),
        expected: {
          headerTitle: ROUTE.TODO_DETAIL,
          isTodoListPage: false,
          isCreatePage: false,
        },
      },
      {
        input: new Request("http://localhost/invalid"),
        expected: {
          headerTitle: "",
          isTodoListPage: false,
          isCreatePage: false,
        },
      },
    ])("returns correct values for $input.url", async ({ input, expected }) => {
      const result = await loader(createLoaderArgs({ request: input }));
      expect(result).toEqual(expected);
    });
  });

  describe("TodosLayout UI", () => {
    type MockRouteOptionsType = {
      path: string;
      headerTitle: string;
      isTodoListPage: boolean;
      isCreatePage: boolean;
    };

    const getMockRoutes = ({
      path,
      headerTitle,
      isTodoListPage,
      isCreatePage,
    }: MockRouteOptionsType) => {
      return [
        {
          path,
          element: <TodosLayout />,
          loader: async () => ({
            headerTitle,
            isTodoListPage,
            isCreatePage,
          }),
        },
      ];
    };

    test("show header title and Back to Todos link, and hides New task button on create page", async () => {
      const router = createMemoryRouter(
        getMockRoutes({
          path: "/todos/new",
          headerTitle: "Create Task",
          isTodoListPage: false,
          isCreatePage: true,
        }),
        {
          initialEntries: ["/todos/new"],
        }
      );

      render(<RouterProvider router={router} />);

      expect(
        await screen.findByRole("heading", { name: "Create Task" })
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Back to Todos")).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "New task" })
      ).not.toBeInTheDocument();
    });

    test("renders header title and show New task button on todos page", async () => {
      const router = createMemoryRouter(
        getMockRoutes({
          path: "/todos",
          headerTitle: "Todos",
          isTodoListPage: true,
          isCreatePage: false,
        }),
        {
          initialEntries: ["/todos"],
        }
      );

      render(<RouterProvider router={router} />);

      expect(
        await screen.findByRole("heading", { name: "Todos" })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("Back to Todos")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "New task" })
      ).toBeInTheDocument();
    });

    test("renders header title and show New task button on todos detail page", async () => {
      const router = createMemoryRouter(
        getMockRoutes({
          path: "/todos/:id",
          headerTitle: "Todos Detail",
          isTodoListPage: false,
          isCreatePage: false,
        }),
        {
          initialEntries: ["/todos/:id"],
        }
      );

      render(<RouterProvider router={router} />);

      expect(
        await screen.findByRole("heading", { name: "Todos Detail" })
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("Back to Todos")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "New task" })
      ).toBeInTheDocument();
    });
  });
});

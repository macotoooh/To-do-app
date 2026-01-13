import { describe, test, expect, vi, beforeEach } from "vitest";
import TodosIndex, { loader } from "./todos._index";
import * as taskModule from "~/server/todos/get-task-list";
import type { Task } from "~/types/tasks";
import { TASK_STATUS } from "~/constants/tasks";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import userEvent from "@testing-library/user-event";

vi.mock("~/server/todos/get-task-list");

describe("todos._index", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Buy groceries",
      content: "Milk, eggs, bread",
      status: TASK_STATUS.TODO,
      createdAt: new Date("2026/01/03/12:00"),
      updatedAt: new Date("2026/01/04/18:00"),
    },
  ];

  describe("loader", () => {
    test("throws 500 error if task fetching fails", async () => {
      // Arrange
      vi.mocked(taskModule.getTaskList).mockRejectedValueOnce(
        new Error("DB is down")
      );

      // Act
      const thrown = loader();

      // Assert
      await expect(thrown).rejects.toMatchObject({
        status: 500,
        statusText: "Internal Server Error",
      });
    });

    test("returns tasks with YYYY/MM/DD HH:mm timestamps", async () => {
      // Arrange
      vi.mocked(taskModule.getTaskList).mockResolvedValueOnce(mockTasks);

      // Act
      const result = await loader();

      // Assert
      expect(taskModule.getTaskList).toHaveBeenCalledOnce();
      expect(result).toEqual([
        {
          ...mockTasks[0],
          createdAt: "2026/01/03 12:00",
          updatedAt: "2026/01/04 18:00",
        },
      ]);
    });
  });

  describe("UI", () => {
    beforeEach(() => {
      vi.mocked(taskModule.getTaskList).mockResolvedValue(mockTasks);
    });

    const renderTodosIndex = (isDeleted?: boolean) => {
      const routes = [
        {
          path: "/todos",
          element: <TodosIndex />,
          loader,
        },
        {
          path: "/todos/1",
          element: <div>Todo Detail</div>,
        },
      ];

      const router = createMemoryRouter(routes, {
        initialEntries: [isDeleted ? "/todos?deleted=true" : "/todos"],
      });

      render(<RouterProvider router={router} />);
      return router;
    };

    test("renders nothing when no tasks are returned", () => {
      // Arrange
      vi.mocked(taskModule.getTaskList).mockResolvedValueOnce([]);
      renderTodosIndex();

      // Assert
      expect(screen.queryByText(/Title/i)).not.toBeInTheDocument();
    });

    test("displays task list when tasks are available", async () => {
      // Arrange
      renderTodosIndex();

      // Assert
      expect(await screen.findByTestId("title-1")).toBeInTheDocument();
      expect(await screen.findByTestId("status-1")).toBeInTheDocument();
      expect(await screen.findByTestId("createdAt-1")).toBeInTheDocument();
    });

    test("shows toast when a task is deleted", async () => {
      // Arrange
      renderTodosIndex(true);

      // Assert
      await waitFor(() =>
        expect(
          screen.getByText("Todo deleted successfully.")
        ).toBeInTheDocument()
      );
    });

    test("navigates to detail page when task row is clicked", async () => {
      // Arrange
      const user = userEvent.setup();
      const router = renderTodosIndex();

      // Act
      await user.click(await screen.findByTestId("title-1"));

      // Assert
      await waitFor(() => {
        expect(router.state.location.pathname).toBe("/todos/1");
      });
    });
  });
});

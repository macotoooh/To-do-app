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
        new Error("DB is down"),
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
          screen.getByText("Todo deleted successfully."),
        ).toBeInTheDocument(),
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

    test("filters tasks when a summary card is selected", async () => {
      // Arrange
      vi.mocked(taskModule.getTaskList).mockResolvedValue([
        ...mockTasks,
        {
          id: "2",
          title: "Ship release",
          content: "v1.0.0",
          status: TASK_STATUS.DONE,
          createdAt: new Date("2026/01/05/12:00"),
          updatedAt: new Date("2026/01/05/12:30"),
        },
      ]);
      const user = userEvent.setup();
      renderTodosIndex();

      expect(await screen.findByTestId("title-1")).toBeInTheDocument();
      expect(await screen.findByTestId("title-2")).toBeInTheDocument();

      // Act
      await user.click(screen.getByRole("button", { name: /done/i }));

      // Assert
      expect(screen.queryByTestId("title-1")).not.toBeInTheDocument();
      expect(await screen.findByTestId("title-2")).toBeInTheDocument();
    });

    test("filters tasks by search keyword", async () => {
      // Arrange
      vi.mocked(taskModule.getTaskList).mockResolvedValue([
        ...mockTasks,
        {
          id: "2",
          title: "Prepare release note",
          content: "Draft and publish",
          status: TASK_STATUS.DOING,
          createdAt: new Date("2026/01/05/12:00"),
          updatedAt: new Date("2026/01/05/12:30"),
        },
      ]);
      const user = userEvent.setup();
      renderTodosIndex();

      // Act
      await user.type(await screen.findByLabelText(/search/i), "release");

      // Assert
      expect(screen.queryByTestId("title-1")).not.toBeInTheDocument();
      expect(await screen.findByTestId("title-2")).toBeInTheDocument();
    });

    test("sorts tasks by title order", async () => {
      // Arrange
      vi.mocked(taskModule.getTaskList).mockResolvedValue([
        {
          id: "1",
          title: "B task",
          content: "Second",
          status: TASK_STATUS.TODO,
          createdAt: new Date("2026/01/03/12:00"),
          updatedAt: new Date("2026/01/04/18:00"),
        },
        {
          id: "2",
          title: "A task",
          content: "First",
          status: TASK_STATUS.TODO,
          createdAt: new Date("2026/01/02/12:00"),
          updatedAt: new Date("2026/01/02/18:00"),
        },
      ]);
      const user = userEvent.setup();
      renderTodosIndex();

      // Act
      await user.selectOptions(
        await screen.findByLabelText(/sort/i),
        "title_asc",
      );

      // Assert
      await waitFor(() => {
        const titles = screen.getAllByTestId(/title-/);
        expect(titles[0]).toHaveTextContent("A task");
        expect(titles[1]).toHaveTextContent("B task");
      });
    });

    test("filters tasks by status filter select", async () => {
      // Arrange
      vi.mocked(taskModule.getTaskList).mockResolvedValue([
        ...mockTasks,
        {
          id: "2",
          title: "Ship release",
          content: "v1.0.0",
          status: TASK_STATUS.DONE,
          createdAt: new Date("2026/01/05/12:00"),
          updatedAt: new Date("2026/01/05/12:30"),
        },
      ]);
      const user = userEvent.setup();
      renderTodosIndex();

      // Act
      await user.selectOptions(
        await screen.findByLabelText(/status filter/i),
        "DONE",
      );

      // Assert
      expect(screen.queryByTestId("title-1")).not.toBeInTheDocument();
      expect(await screen.findByTestId("title-2")).toBeInTheDocument();
    });

    test("clears active filters when clear button is clicked", async () => {
      // Arrange
      vi.mocked(taskModule.getTaskList).mockResolvedValue([
        {
          id: "1",
          title: "Buy groceries",
          content: "Milk, eggs, bread",
          status: TASK_STATUS.TODO,
          createdAt: new Date("2026/01/03/12:00"),
          updatedAt: new Date("2026/01/04/18:00"),
        },
        {
          id: "2",
          title: "Ship release",
          content: "v1.0.0",
          status: TASK_STATUS.DONE,
          createdAt: new Date("2026/01/05/12:00"),
          updatedAt: new Date("2026/01/05/12:30"),
        },
      ]);
      const user = userEvent.setup();
      renderTodosIndex();

      await user.type(await screen.findByLabelText(/search/i), "not-found");
      expect(
        await screen.findByText(/No tasks match your filters/i),
      ).toBeInTheDocument();

      // Act
      await user.click(screen.getByRole("button", { name: /clear filters/i }));

      // Assert
      expect(await screen.findByTestId("title-1")).toBeInTheDocument();
      expect(await screen.findByTestId("title-2")).toBeInTheDocument();
      expect(
        screen.queryByText(/No tasks match your filters/i),
      ).not.toBeInTheDocument();
    });

    test("resets search, status, sort and URL query when top clear button is clicked", async () => {
      // Arrange
      vi.mocked(taskModule.getTaskList).mockResolvedValue([
        {
          id: "1",
          title: "Buy groceries",
          content: "Milk, eggs, bread",
          status: TASK_STATUS.TODO,
          createdAt: new Date("2026/01/03/12:00"),
          updatedAt: new Date("2026/01/04/18:00"),
        },
        {
          id: "2",
          title: "Ship release",
          content: "v1.0.0",
          status: TASK_STATUS.DONE,
          createdAt: new Date("2026/01/05/12:00"),
          updatedAt: new Date("2026/01/05/12:30"),
        },
      ]);
      const user = userEvent.setup();
      const router = renderTodosIndex();

      const searchInput = await screen.findByLabelText(/search/i);
      const statusFilter = await screen.findByLabelText(/status filter/i);
      const sortFilter = await screen.findByLabelText(/sort/i);

      await user.type(searchInput, "ship");
      await user.selectOptions(statusFilter, TASK_STATUS.DONE);
      await user.selectOptions(sortFilter, "title_desc");

      // Act
      await user.click(screen.getByRole("button", { name: /^clear$/i }));

      // Assert
      await waitFor(() => {
        expect(router.state.location.search).toBe("");
      });
      expect(searchInput).toHaveValue("");
      expect(statusFilter).toHaveValue("");
      expect(sortFilter).toHaveValue("created_desc");
    });
  });
});

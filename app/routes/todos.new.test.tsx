import { describe, test, expect, vi, beforeEach } from "vitest";
import NewTodo, { action } from "./todos.new";
import { createTask } from "~/server/todos/create-task";
import { createActionArgs } from "~/utils/test-router-args";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { TASK_STATUS } from "~/constants/tasks";

vi.mock("~/server/todos/create-task", () => ({
  createTask: vi.fn(),
}));

const getFormData = () => {
  const formData = new FormData();
  formData.append("title", "Tes title");
  formData.append("content", "Test content");
  formData.append("status", TASK_STATUS.TODO);
  return formData;
};

describe("todos.new", () => {
  describe("action", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("returns error message when task creation fails", async () => {
      // Arrange
      vi.mocked(createTask).mockRejectedValueOnce(new Error("Create failed"));
      const formData = getFormData();
      const request = new Request("http://localhost/todos/new", {
        method: "POST",
        body: formData,
      });

      // Act
      const result = await action(createActionArgs(request));

      // Assert
      expect(result).toEqual({
        error: "Failed to create task. Please try again.",
      });
    });

    test("redirects to /todos/:id with created query when task creation succeeds", async () => {
      // Arrange
      vi.mocked(createTask).mockResolvedValueOnce({
        id: `1-1-1-1-1`,
        title: "Test",
        content: "Test content",
        status: "TODO",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const formData = getFormData();
      const request = new Request("http://localhost/todos/new", {
        method: "POST",
        body: formData,
      });

      // Act
      const response = await action(createActionArgs(request));

      // Assert
      if (response instanceof Response) {
        expect(response.status).toBe(302);
        expect(response.headers.get("Location")).toBe(
          "/todos/1-1-1-1-1?created=true"
        );
      }
    });
  });

  describe("UI", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    const renderNewTodo = ({ useAction = false } = {}) => {
      const routes = [
        {
          path: "/todos/new",
          element: <NewTodo />,
          ...(useAction && { action }),
        },
      ];

      if (useAction) {
        routes.push({
          path: "/todos/:id",
          element: <>Todo Detail</>,
        });
      }

      const router = createMemoryRouter(routes, {
        initialEntries: ["/todos/new"],
      });

      render(<RouterProvider router={router} />);
      return router;
    };

    test("Displays validation errors when form is submitted without input", async () => {
      // Arrange
      renderNewTodo();
      const user = userEvent.setup();

      // Action
      await user.click(screen.getByRole("button", { name: /save/i }));

      // Assert
      expect(await screen.findByText(/Title is required/i)).toBeInTheDocument();
      expect(
        await screen.findByText(/Content is required/i)
      ).toBeInTheDocument();
    });

    test("Redirects to detail page after successful form submission", async () => {
      // Arrange
      vi.mocked(createTask).mockResolvedValueOnce({
        id: "6",
        title: "Test Task",
        content: "Test content",
        status: TASK_STATUS.TODO,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const user = userEvent.setup();
      const router = renderNewTodo({ useAction: true });

      // Act
      await user.type(screen.getByLabelText(/title/i), "Test Task");
      await user.type(screen.getByLabelText(/content/i), "Test content");
      await user.selectOptions(
        screen.getByLabelText(/status/i),
        TASK_STATUS.TODO
      );
      await user.click(screen.getByRole("button", { name: /save/i }));

      // Assert
      await waitFor(() => {
        expect(router.state.location.pathname).toBe("/todos/6");
        expect(router.state.location.search).toBe("?created=true");
      });
    });

    test("Displays toast message when task creation fails", async () => {
      // Arrange
      vi.mocked(createTask).mockRejectedValueOnce(new Error("Create failed"));
      const user = userEvent.setup();
      renderNewTodo({ useAction: true });

      // Action
      await user.type(screen.getByLabelText(/title/i), "Test Task");
      await user.type(screen.getByLabelText(/content/i), "Test content");
      await user.selectOptions(
        screen.getByLabelText(/status/i),
        TASK_STATUS.DOING
      );
      await user.click(screen.getByRole("button", { name: /save/i }));

      // Assert
      expect(
        await screen.findByText(/Failed to create task. Please try again./i)
      ).toBeInTheDocument();
    });
  });
});

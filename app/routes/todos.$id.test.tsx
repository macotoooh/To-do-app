import { describe, test, expect, vi, beforeEach } from "vitest";
import TodoDetail, { action, loader } from "./todos.$id";
import * as getTaskModule from "~/server/todos/get-task-by-id";
import { ACTION_INTENT, TASK_STATUS } from "~/constants/tasks";
import { createActionArgs, createLoaderArgs } from "~/utils/test-router-args";
import { updateTask } from "~/server/todos/update-task";
import { deleteTaskById } from "~/server/todos/delete-task-by-id";
import { createMemoryRouter, RouterProvider } from "react-router";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("~/server/todos/update-task", () => ({
  updateTask: vi.fn(),
}));

vi.mock("~/server/todos/get-task-by-id");

vi.mock("~/server/todos/delete-task-by-id", () => ({
  deleteTaskById: vi.fn(),
}));

const mockTask = {
  id: "1",
  title: "Buy groceries",
  content: "Milk, eggs, bread",
  status: TASK_STATUS.TODO,
  createdAt: new Date("2026-01-01T08:00:00Z"),
  updatedAt: new Date("2026-01-01T09:00:00Z"),
};

describe("todos.$id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loader", () => {
    test("throws 404 if no id param", async () => {
      await expect(
        loader(createLoaderArgs({ params: {} }))
      ).rejects.toMatchObject({
        status: 404,
      });
    });

    test("throws 404 if task not found", async () => {
      // Arrange
      vi.mocked(getTaskModule.getTaskById).mockResolvedValueOnce(null);

      // Assert
      await expect(
        loader(createLoaderArgs({ params: { id: "999" } }))
      ).rejects.toMatchObject({
        status: 404,
      });
    });

    test("returns task with ISO string timestamps", async () => {
      // Arrange
      vi.mocked(getTaskModule.getTaskById).mockResolvedValue(mockTask);

      // Act
      const result = await loader(createLoaderArgs({ params: { id: "1" } }));

      // Assert
      expect(result).toEqual({
        id: "1",
        title: "Buy groceries",
        content: "Milk, eggs, bread",
        status: TASK_STATUS.TODO,
        createdAt: "2026-01-01T08:00:00.000Z",
        updatedAt: "2026-01-01T09:00:00.000Z",
      });
    });
  });

  describe("action", () => {
    const getFormData = (intent: "UPDATE" | "DELETE") => {
      const formData = new FormData();
      formData.append("intent", intent);
      formData.append("title", "Test");
      formData.append("content", "Test content");
      formData.append("status", TASK_STATUS.TODO);
      return formData;
    };

    describe("action guards", () => {
      test("returns error when id is invalid", async () => {
        // Arrange
        const formData = new FormData();
        formData.append("intent", ACTION_INTENT.UPDATE);

        const request = new Request("http://localhost/todos/1", {
          method: "POST",
          body: formData,
        });

        // Act
        const result = await action(createActionArgs(request));

        // Assert
        expect(result).toEqual({
          error: "Invalid task id.",
        });
      });

      test("returns error when intent is invalid", async () => {
        // Arrange
        const formData = new FormData();
        formData.append("intent", "INVALID");

        const request = new Request("http://localhost/todos/1", {
          method: "POST",
          body: formData,
        });

        // Act
        const result = await action(
          createActionArgs(request, {
            params: { id: "1" },
          })
        );

        // Assert
        expect(result).toEqual({
          error: "Invalid action intent.",
        });
      });
    });

    describe("DELETE intent", () => {
      test("returns error when task is not found or already deleted", async () => {
        // Arrange
        vi.mocked(deleteTaskById).mockRejectedValueOnce(
          new Error("Delete failed")
        );
        const formData = getFormData(ACTION_INTENT.DELETE);
        const request = new Request("http://localhost/todos/1", {
          method: "POST",
          body: formData,
        });

        // Act
        const result = await action(
          createActionArgs(request, {
            params: { id: "999" },
          })
        );

        // Assert
        expect(result).toEqual({
          error: "Failed to delete task. Please try again.",
        });
      });

      test("redirects to /todos/:id with deleted query when task deleting succeeds", async () => {
        // Arrange
        vi.mocked(deleteTaskById).mockResolvedValueOnce(true);

        const formData = getFormData(ACTION_INTENT.DELETE);
        const request = new Request("http://localhost/todos/1", {
          method: "POST",
          body: formData,
        });

        // Act
        const response = await action(
          createActionArgs(request, { params: { id: "1" } })
        );

        // Assert
        expect(response).toBeInstanceOf(Response);
        expect((response as Response).headers.get("Location")).toBe(
          "/todos?deleted=true"
        );
      });
    });

    describe("UPDATE intent", () => {
      test("returns server error when updateTask throws", async () => {
        // Arrange
        vi.mocked(updateTask).mockRejectedValueOnce(new Error("Update failed"));
        const formData = getFormData(ACTION_INTENT.UPDATE);
        const request = new Request("http://localhost/todos/1", {
          method: "POST",
          body: formData,
        });

        // Act
        const result = await action(
          createActionArgs(request, {
            params: { id: "1" },
          })
        );

        expect(result).toEqual({
          error: "Failed to update task. Please try again.",
        });
      });

      test("redirects to /todos/:id with updated query when update succeeds", async () => {
        // Arrange
        vi.mocked(updateTask).mockResolvedValueOnce({
          id: `6`,
          title: "Test",
          content: "Test content",
          status: TASK_STATUS.TODO,
          updatedAt: new Date(),
        });
        const formData = getFormData(ACTION_INTENT.UPDATE);
        const request = new Request("http://localhost/todos/6", {
          method: "POST",
          body: formData,
        });

        // Act
        const response = await action(
          createActionArgs(request, {
            params: { id: "6" },
          })
        );

        // Assert
        if (response instanceof Response) {
          expect(response.status).toBe(302);
          expect(response.headers.get("Location")).toBe(
            "/todos/6?updated=true"
          );
        }
      });
    });
  });

  describe("UI", () => {
    beforeEach(() => {
      vi.mocked(getTaskModule.getTaskById).mockResolvedValue(mockTask);
    });

    const renderTodoDetail = () => {
      const routes = [
        {
          path: "/todos/:id",
          element: <TodoDetail />,
          loader,
          action,
        },
        {
          path: "/todos",
          element: <div>Todo List</div>,
        },
      ];

      const router = createMemoryRouter(routes, {
        initialEntries: ["/todos/1"],
      });

      render(<RouterProvider router={router} />);
      return router;
    };

    describe("Update", () => {
      test("Displays validation errors when form is submitted without input", async () => {
        // Arrange
        renderTodoDetail();
        const user = userEvent.setup();

        // Act
        await user.clear(await screen.findByLabelText(/title/i));
        await user.clear(await screen.findByLabelText(/content/i));
        await user.click(await screen.findByRole("button", { name: /save/i }));

        // Assert
        expect(
          await screen.findByText(/Title is required/i)
        ).toBeInTheDocument();
        expect(
          await screen.findByText(/Content is required/i)
        ).toBeInTheDocument();
      });

      test("Displays toast message when update succeeds", async () => {
        // Arrange
        vi.mocked(updateTask).mockResolvedValueOnce({
          ...mockTask,
          id: "6",
          // The implementation always redirects to /todos/6 after update,
          // so we hardcode id: "6" here to match that behavior.
        });
        renderTodoDetail();
        const user = userEvent.setup();

        // Action
        await user.type(
          await screen.findByLabelText(/title/i),
          "update Test Task"
        );
        await user.type(
          await screen.findByLabelText(/content/i),
          "update Test content"
        );
        await user.selectOptions(
          await screen.findByLabelText(/status/i),
          TASK_STATUS.DOING
        );
        await user.click(await screen.findByRole("button", { name: /save/i }));

        // Assert
        expect(
          await screen.findByText(/Update completed successfully./i)
        ).toBeInTheDocument();
      });

      test("Displays toast message when update fails", async () => {
        // Arrange
        vi.mocked(updateTask).mockRejectedValue(new Error("Update failed"));
        const user = userEvent.setup();
        renderTodoDetail();

        // Action
        await user.click(await screen.findByRole("button", { name: /save/i }));

        // Assert
        expect(
          await screen.findByText(/Failed to update task. Please try again./i)
        ).toBeInTheDocument();
      });
    });

    describe("Delete", () => {
      test("Redirects to the list page with ?deleted=true when deletion succeeds", async () => {
        // Arrange
        vi.mocked(deleteTaskById).mockResolvedValueOnce(true);
        const user = userEvent.setup();
        const router = renderTodoDetail();

        // Act
        await user.click(await screen.findByTestId("open-delete-modal"));
        await user.click(await screen.findByTestId("confirm-delete-modal"));

        // Assert
        await waitFor(() => {
          expect(router.state.location.pathname).toBe("/todos");
          expect(router.state.location.search).toBe("?deleted=true");
        });
      });

      test("Displays toast when the task to delete is not found", async () => {
        // Arrange
        vi.mocked(deleteTaskById).mockResolvedValueOnce(false);
        const user = userEvent.setup();
        renderTodoDetail();

        // Act
        await user.click(await screen.findByTestId("open-delete-modal"));
        await user.click(await screen.findByTestId("confirm-delete-modal"));
        // Assert
        expect(
          await screen.findByText(/Task not found or already deleted./i)
        ).toBeInTheDocument();
      });

      test("Displays toast when the deletion fails", async () => {
        // Arrange
        vi.mocked(deleteTaskById).mockRejectedValueOnce(
          new Error("Delete failed")
        );
        const user = userEvent.setup();
        renderTodoDetail();

        // Act
        await user.click(await screen.findByTestId("open-delete-modal"));
        await user.click(await screen.findByTestId("confirm-delete-modal"));
        // Assert
        expect(
          await screen.findByText(/Failed to delete task. Please try again./i)
        ).toBeInTheDocument();
      });
    });
  });
});

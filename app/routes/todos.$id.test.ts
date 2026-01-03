import { describe, test, expect, vi, beforeEach } from "vitest";
import { action, loader } from "./todos.$id";
import * as getTaskModule from "~/server/todos/get-task-by-id";
import { ACTION_INTENT, TASK_STATUS } from "~/constants/tasks";
import { createActionArgs, createLoaderArgs } from "~/utils/test-router-args";
import { updateTask } from "~/server/todos/update-task";
import { deleteTaskById } from "~/server/todos/delete-task-by-id";

vi.mock("~/server/todos/update-task", () => ({
  updateTask: vi.fn(),
}));

vi.mock("~/server/todos/get-task-by-id");

vi.mock("~/server/todos/delete-task-by-id", () => ({
  deleteTaskById: vi.fn(),
}));

describe("todos.$id loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
    const mockTask = {
      id: "1",
      title: "Test",
      content: "Content",
      status: TASK_STATUS.TODO,
      createdAt: new Date("2025-12-30T12:00:00Z"),
      updatedAt: new Date("2025-12-30T13:00:00Z"),
    };
    vi.mocked(getTaskModule.getTaskById).mockResolvedValueOnce(mockTask);

    // Act
    const result = await loader(createLoaderArgs({ params: { id: "1" } }));

    // Assert
    expect(result).toEqual({
      id: "1",
      title: "Test",
      content: "Content",
      status: TASK_STATUS.TODO,
      createdAt: "2025-12-30T12:00:00.000Z",
      updatedAt: "2025-12-30T13:00:00.000Z",
    });
  });
});

describe("todos.$id action", () => {
  const getFormData = (intent: "UPDATE" | "DELETE") => {
    const formData = new FormData();
    formData.append("intent", intent);
    formData.append("title", "Test");
    formData.append("content", "Test content");
    formData.append("status", TASK_STATUS.TODO);
    return formData;
  };

  describe("action guards", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

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
    beforeEach(() => {
      vi.clearAllMocks();
    });

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
    beforeEach(() => {
      vi.clearAllMocks();
    });
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
        expect(response.headers.get("Location")).toBe("/todos/6?updated=true");
      }
    });
  });
});

import { describe, test, expect, vi, beforeEach } from "vitest";
import { updateTask } from "~/server/todos/update-task";
import { action, loader } from "./todos.$id";
import * as getTaskModule from "~/server/todos/get-task-by-id";
import { TASK_STATUS } from "~/constants/tasks";

vi.mock("~/server/todos/update-task", () => ({
  updateTask: vi.fn(),
}));

vi.mock("~/server/todos/get-task-by-id");

describe("todos.$id loader", () => {
  test("returns task with ISO string timestamps", async () => {
    // Arrange:
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
    const result = await loader({ params: { id: "1" } } as any);

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

  test("throws 404 if no id param", async () => {
    await expect(loader({ params: {} } as any)).rejects.toMatchObject({
      status: 404,
    });
  });

  test("throws 404 if task not found", async () => {
    // Arrange
    vi.mocked(getTaskModule.getTaskById).mockResolvedValueOnce(null);

    // Assert
    await expect(
      loader({ params: { id: "999" } } as any)
    ).rejects.toMatchObject({
      status: 404,
    });
  });
});

describe("todos.$id action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("returns error message when task updating fails", async () => {
    // Arrange:
    vi.mocked(updateTask).mockRejectedValueOnce(new Error("Updated failed"));
    const formData = new FormData();
    formData.append("title", "Test");
    formData.append("content", "Test content");
    formData.append("status", TASK_STATUS.TODO);
    const request = new Request("http://localhost/todos/.$id", {
      method: "POST",
      body: formData,
    });

    // Act
    const result = await action({ request } as any);

    // Assert
    expect(result).toEqual({
      error: "Failed to update task. Please try again.",
    });
  });

  test("redirects to todo detail page when task updating succeeds", async () => {
    // Arrange:
    vi.mocked(updateTask).mockResolvedValueOnce({
      id: `6`,
      title: "Test",
      content: "Test content",
      status: TASK_STATUS.TODO,
      updatedAt: new Date(),
    });
    const formData = new FormData();
    formData.append("title", "Test");
    formData.append("content", "Test content");
    formData.append("status", TASK_STATUS.TODO);
    const request = new Request("http://localhost/todos/.$id", {
      method: "POST",
      body: formData,
    });

    // Act
    const response = await action({ request } as any);

    // Assert
    if (response instanceof Response) {
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe("/todos/6?updated=true");
    }
  });
});

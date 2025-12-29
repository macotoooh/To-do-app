import { describe, test, expect, vi, beforeEach } from "vitest";
import { action } from "./todos.new";
import { createTask } from "~/server/todos/create-task";

vi.mock("~/server/todos/create-task", () => ({
  createTask: vi.fn(),
}));

describe("todos.new action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test("returns error message when task creation fails", async () => {
    // Arrange:
    vi.mocked(createTask).mockRejectedValueOnce(new Error("Create failed"));
    const formData = new FormData();
    formData.append("title", "Test");
    formData.append("content", "Test content");
    formData.append("status", "TODO");
    const request = new Request("http://localhost/todos/new", {
      method: "POST",
      body: formData,
    });

    // Act
    const result = await action({ request } as any);

    // Assert
    expect(result).toEqual({
      error: "Failed to create task. Please try again.",
    });
  });

  test("redirects to todo detail page when task creation succeeds", async () => {
    // Arrange:
    vi.mocked(createTask).mockResolvedValueOnce({
      id: `1-1-1-1-1`,
      title: "Test",
      content: "Test content",
      status: "TODO",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const formData = new FormData();
    formData.append("title", "Test");
    formData.append("content", "Test content");
    formData.append("status", "TODO");
    const request = new Request("http://localhost/todos/new", {
      method: "POST",
      body: formData,
    });

    // Act
    const response = await action({ request } as any);

    // Assert
    if (response instanceof Response) {
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe("/todos/1-1-1-1-1");
    }
  });
});

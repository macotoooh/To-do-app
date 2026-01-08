import { describe, test, expect, vi, beforeEach } from "vitest";
import { loader } from "./todos._index";
import * as taskModule from "~/server/todos/get-task-list";
import type { Task } from "~/types/tasks";
import { TASK_STATUS } from "~/constants/tasks";

vi.mock("~/server/todos/get-task-list");

describe("todos._index loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  test("returns tasks with ISO string timestamps", async () => {
    // Arrange
    const mockTasks: Task[] = [
      {
        id: "1",
        title: "Buy groceries",
        content: "Milk, eggs, bread",
        status: TASK_STATUS.TODO,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-02T00:00:00Z"),
      },
    ];

    vi.mocked(taskModule.getTaskList).mockResolvedValueOnce(mockTasks);

    // Act
    const result = await loader();

    // Assert
    expect(taskModule.getTaskList).toHaveBeenCalledOnce();
    expect(result).toEqual([
      {
        ...mockTasks[0],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
    ]);
  });
});

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

  test("returns tasks with YYYY/MM/DD HH:mm timestamps", async () => {
    // Arrange
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

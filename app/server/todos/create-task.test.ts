import { describe, expect, test } from "vitest";
import { createTask } from "./create-task";

describe("createTask", () => {
  test("returns a new task with generated id and timestamps", async () => {
    const task = await createTask({
      title: "Test",
      content: "Test content",
      status: "TODO",
    });

    expect(task.id).toBeDefined();
    expect(task.title).toBe("Test");
    expect(task.createdAt).toBeInstanceOf(Date);
    expect(task.updatedAt).toBeInstanceOf(Date);
  });
});

import { describe, test, expect, beforeAll, afterAll, vi } from "vitest";
import { updateTask } from "./update-task";

describe("updateTask", () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-12-30T12:00:00Z"));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test("returns a task with consistent updatedAt", async () => {
    const promise = updateTask({
      id: "1",
      title: "Test",
      content: "Test content",
      status: "TODO",
    });

    // Simulate the 1200ms delay used in updateTask (needed when using fake timers)
    vi.advanceTimersByTime(1200);

    const task = await promise;

    expect(task.updatedAt).toEqual(new Date("2025-12-30T12:00:01.200Z"));
  });
});

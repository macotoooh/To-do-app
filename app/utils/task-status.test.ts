import { describe, test, expect } from "vitest";
import { getTaskStatus } from "./task-status";
import { TASK_STATUS } from "~/constants/tasks";

describe("getTaskStatus", () => {
  const errorMessage = "Invalid task status";
  test.each([TASK_STATUS.TODO, TASK_STATUS.DOING, TASK_STATUS.DONE])(
    "returns valid TaskStatus for %s",
    (status) => {
      expect(getTaskStatus(status)).toBe(status);
    }
  );

  test("throws an error for invalid status", () => {
    expect(() => getTaskStatus("INVALID")).toThrowError(errorMessage);
  });

  test("throws an error for non-string values", () => {
    expect(() => getTaskStatus(undefined)).toThrowError(errorMessage);
    expect(() => getTaskStatus(null)).toThrowError(errorMessage);
    expect(() => getTaskStatus(123)).toThrowError(errorMessage);
    expect(() => getTaskStatus({})).toThrowError(errorMessage);
  });
});

import { describe, test, expect } from "vitest";
import { getTaskStatus, isTaskStatus } from "./task-status";
import { TASK_STATUS } from "~/constants/tasks";

describe("isTaskStatus", () => {
  test.each([TASK_STATUS.TODO, TASK_STATUS.DOING, TASK_STATUS.DONE])(
    "returns true for %s",
    (status) => {
      expect(isTaskStatus(status)).toBe(true);
    }
  );

  test.each(["INVALID", "", undefined, null, 123, {}, []])(
    "returns false for invalid value: %p",
    (value) => {
      expect(isTaskStatus(value)).toBe(false);
    }
  );
});

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

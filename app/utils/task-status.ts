import { TASK_STATUS, type TaskStatus } from "~/constants/tasks";

/**
 * Type guard that checks whether a value is a valid TaskStatus.
 *
 * Useful when handling untrusted input such as URL query params or form data.
 *
 * @param value - Unknown input value
 * @returns true if the value is one of TASK_STATUS (TODO, DOING, DONE)
 */
export const isTaskStatus = (value: unknown): value is TaskStatus => {
  return (
    value === TASK_STATUS.TODO ||
    value === TASK_STATUS.DOING ||
    value === TASK_STATUS.DONE
  );
};

/**
 * Normalizes external input into a valid TaskStatus.
 *
 * Used at boundaries where untrusted values (e.g. form data) are received.
 *
 * @param status Untrusted input value
 * @returns A valid TaskStatus
 * @throws Error if the input value is not a valid task status
 */
export const getTaskStatus = (status: unknown): TaskStatus => {
  if (isTaskStatus(status)) {
    return status;
  }

  throw new Error("Invalid task status");
};

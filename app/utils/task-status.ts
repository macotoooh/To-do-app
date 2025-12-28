import { TASK_STATUS, type TaskStatus } from "~/constants/tasks";

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
  if (
    status === TASK_STATUS.TODO ||
    status === TASK_STATUS.DOING ||
    status === TASK_STATUS.DONE
  ) {
    return status;
  }

  throw new Error("Invalid task status");
};

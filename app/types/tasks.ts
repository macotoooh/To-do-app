import type { TASK_STATUS } from "~/constants/tasks";

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export type Task = {
  id: string;
  title: string;
  content: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * DTO used for transporting task data to the UI.
 * Date objects are converted to strings at the route boundary
 * because loader data must be serializable.
 */
export type TaskDTO = Omit<Task, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

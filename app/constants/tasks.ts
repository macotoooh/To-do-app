export const TASK_STATUS = {
  TODO: "TODO",
  DOING: "DOING",
  DONE: "DONE",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

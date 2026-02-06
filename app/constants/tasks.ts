export const TASK_STATUS = {
  TODO: "TODO",
  DOING: "DOING",
  DONE: "DONE",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export const ACTION_INTENT = {
  UPDATE: "UPDATE",
  DELETE: "DELETE",
} as const;

export type ActionIntent = "UPDATE" | "DELETE";

export const TASK_STATUS_VALUES = Object.values(TASK_STATUS);

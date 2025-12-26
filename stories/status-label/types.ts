import type { TASK_STATUS } from "~/constants/tasks";

export type StatusVariant = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

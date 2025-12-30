import { z } from "zod";
import { TASK_STATUS } from "~/constants/tasks";

const TaskBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content is too long"),
  status: z.enum([TASK_STATUS.TODO, TASK_STATUS.DOING, TASK_STATUS.DONE]),
});

export const CreateTaskSchema = TaskBaseSchema;
export const UpdateTaskSchema = TaskBaseSchema;

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;

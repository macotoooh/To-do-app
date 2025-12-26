import type { Task } from "~/types/tasks";
import { TASK_STATUS } from "~/constants/tasks";

export async function createTask(
  input: Pick<Task, "title" | "content" | "status">
) {
  console.log("Creating task:", input);

  return {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

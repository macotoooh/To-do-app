import type { Task } from "~/types/tasks";

/**
 * Creates a new task (mock implementation).
 *
 * This function simulates a task creation API and does not persist data.
 *
 * @param input Task creation payload (title, content, status)
 * @returns Newly created task object with generated id and timestamps
 */
export const createTask = async (
  input: Pick<Task, "title" | "content" | "status">
) => {
  console.log("Creating task:", input);

  // Simulates network latency to allow loading states to be tested.
  await new Promise((r) => setTimeout(r, 1200));

  return {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

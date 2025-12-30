import type { Task } from "~/types/tasks";

/**
 * Update a new task (mock implementation).
 *
 * This function simulates a task creation API and does not persist data.
 *
 * @param input Task creation payload (title, content, status)
 * @returns Newly created task object with generated id and timestamps
 */
export const updateTask = async (
  input: Pick<Task, "id" | "title" | "content" | "status">
) => {
  console.log("Updating task:", input);

  // Simulates network latency to allow loading states to be tested.
  await new Promise((r) => setTimeout(r, 1200));

  return {
    ...input,
    updatedAt: new Date(),
  };
};

import { getTaskList } from "./get-task-list";

/**
 * Get a task by id.
 *
 * This function simulates a task get API and does not persist data.
 *
 * @param id Task id
 * @returns The task having same id with input id
 */
export const getTaskById = async (id: string) => {
  const tasks = await getTaskList();
  return tasks.find((task) => task.id === id) ?? null;
};

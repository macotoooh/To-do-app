import { getTaskList } from "./get-task-list";

/**
 * Mocks the deletion of a task by ID.
 *
 * @param id - ID of the task to delete
 * @returns true if the task existed (and was 'deleted'), false otherwise
 */
export const deleteTaskById = async (id: string) => {
  const tasks = await getTaskList();

  const taskExists = tasks.some((task) => task.id === id);

  // Simulate async operation and deletion side-effect
  await new Promise((r) => setTimeout(r, 1200));

  return taskExists;
};

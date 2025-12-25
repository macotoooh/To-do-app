import { TASK_STATUS } from "~/constants/tasks";
import type { Task } from "~/types/tasks";

/**
 * Mock function for fetching todo list (demo data)
 */
export const getTaskList = async (): Promise<Task[]> => {
  return [
    {
      id: "1",
      title: "Buy groceries",
      content: "Milk, eggs, bread",
      status: TASK_STATUS.TODO,
      createdAt: new Date("2026-01-01T09:00:00Z"),
      updatedAt: new Date("2026-01-01T09:00:00Z"),
    },
    {
      id: "2",
      title: "Clean the living room",
      content: "Vacuum and wipe the floor",
      status: TASK_STATUS.DOING,
      createdAt: new Date("2026-01-02T10:00:00Z"),
      updatedAt: new Date("2026-01-02T12:00:00Z"),
    },
    {
      id: "3",
      title: "Write blog post",
      content: "VS Code productivity tips",
      status: TASK_STATUS.TODO,
      createdAt: new Date("2026-01-03T08:30:00Z"),
      updatedAt: new Date("2026-01-03T08:30:00Z"),
    },
    {
      id: "4",
      title: "Fix login bug",
      content: "Resolve auth redirect issue",
      status: TASK_STATUS.DOING,
      createdAt: new Date("2026-01-04T09:15:00Z"),
      updatedAt: new Date("2026-01-04T11:45:00Z"),
    },
    {
      id: "5",
      title: "Submit expense report",
      content: "April transportation costs",
      status: TASK_STATUS.DONE,
      createdAt: new Date("2026-01-05T13:00:00Z"),
      updatedAt: new Date("2026-01-05T14:00:00Z"),
    },
    {
      id: "6",
      title: "Review pull request",
      content: "Check task-board UI implementation",
      status: TASK_STATUS.DONE,
      createdAt: new Date("2026-01-06T16:00:00Z"),
      updatedAt: new Date("2026-01-06T17:30:00Z"),
    },
  ];
};

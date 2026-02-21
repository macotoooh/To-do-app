import type { ActionFunctionArgs } from "react-router";
import { TASK_STATUS } from "~/constants/tasks";
import { suggestTaskPriorities } from "~/services/ai/suggest-task";
import { requireString } from "~/utils/form";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const tasksJson = requireString(formData.get("tasks"), "tasks");
  const tasks = JSON.parse(tasksJson) as Array<{
    id: string;
    title: string;
    status: "TODO" | "DOING" | "DONE";
    content?: string;
  }>;
  const openTasks = tasks.filter((task) => task.status !== TASK_STATUS.DONE);
  const items = await suggestTaskPriorities(openTasks);

  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

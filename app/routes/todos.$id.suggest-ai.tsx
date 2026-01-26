import type { ActionFunctionArgs } from "react-router";
import { suggestTasks } from "~/services/ai/suggest-task";
import { requireString } from "~/utils/form";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = requireString(formData.get("title"), "title");
  const suggestions = await suggestTasks(title);

  return new Response(JSON.stringify({ suggestions }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

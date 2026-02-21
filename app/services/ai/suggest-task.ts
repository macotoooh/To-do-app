import { callOpenAI } from "~/server/ai/openai.server";
import type { TaskStatus } from "~/types/tasks";

type PrioritizerInputTask = {
  id: string;
  title: string;
  status: TaskStatus;
  content?: string;
};

export type PrioritizedTask = {
  id: string;
  score: number;
  reason: string;
};

const extractJSONObject = (text: string): string | null => {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
    return null;
  }
  return text.slice(firstBrace, lastBrace + 1);
};

/**
 * Generates task suggestions based on a given task title using AI.
 *
 * This function sends the title to OpenAI, requests a bullet list of
 * actionable task ideas, and normalizes the response into a string array.
 *
 * The returned suggestions are cleaned by:
 * - Splitting the AI output by new lines
 * - Removing bullet symbols (e.g. "-" or "*")
 * - Trimming whitespace and filtering out empty lines
 *
 * @param title - The base task title provided by the user
 * @returns A list of suggested task titles
 *
 * @throws Error when the AI quota is exceeded or an unexpected error occurs
 */
export const suggestTasks = async (title: string): Promise<string[]> => {
  const prompt = `
Suggest 3 actionable todo task titles based on the following task:

"${title}"

Return only a bullet list of task titles.
`;

  try {
    const text = await callOpenAI(prompt);
    return text
      .split("\n")
      .map((line) => line.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  } catch (err: any) {
    if (err.status === 429) {
      throw new Error("AI quota exceeded");
    }
    throw err;
  }
};

/**
 * Generates AI priority scores for a task list.
 *
 * @param tasks - Task list to prioritize
 * @returns List of task ids with score (0-100) and short reasoning
 */
export const suggestTaskPriorities = async (
  tasks: PrioritizerInputTask[],
): Promise<PrioritizedTask[]> => {
  const prompt = `
You are a task prioritization assistant.
Score each task from 0 to 100 based on impact and urgency.

Tasks:
${tasks
  .map(
    (task) =>
      `- id: ${task.id}, title: ${task.title}, status: ${task.status}, content: ${task.content ?? "N/A"}`,
  )
  .join("\n")}

Return only JSON in this format:
{
  "items": [
    { "id": "task-id", "score": 78, "reason": "short reason" }
  ]
}
`;

  try {
    const text = await callOpenAI(prompt);
    const jsonText = extractJSONObject(text);
    if (!jsonText) return [];
    const parsed = JSON.parse(jsonText) as { items?: PrioritizedTask[] };

    return (parsed.items ?? [])
      .filter(
        (item) =>
          typeof item?.id === "string" &&
          typeof item?.score === "number" &&
          typeof item?.reason === "string",
      )
      .map((item) => ({
        id: item.id,
        score: Math.max(0, Math.min(100, Math.round(item.score))),
        reason: item.reason.trim(),
      }));
  } catch (err: any) {
    if (err.status === 429) {
      throw new Error("AI quota exceeded");
    }
    throw err;
  }
};

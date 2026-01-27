import { callOpenAI } from "~/server/ai/openai.server";

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

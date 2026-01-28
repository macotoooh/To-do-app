import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Calls OpenAI Responses API and returns generated text.
 * Throws an error if no text output is returned.
 */
export const callOpenAI = async (prompt: string): Promise<string> => {
  const response = await client.responses.create({
    model: "gpt-5-nano",
    input: prompt,
  });
  if (!response.output_text) {
    throw new Error("No output from OpenAI");
  }

  return response.output_text;
};

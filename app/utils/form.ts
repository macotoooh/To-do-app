/**
 * Ensures that a FormData value is a non-empty string.
 * If the value is missing or not a string, it throws a 400 Response.
 *
 * @param value - The value retrieved from FormData.
 * @param fieldName - The name of the field (used for error messages).
 * @returns The validated string value.
 */
export const requireString = (
  value: FormDataEntryValue | null,
  fieldName: string,
) => {
  if (!value || typeof value !== "string") {
    throw new Response(JSON.stringify({ error: `${fieldName} is required` }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  return value;
};

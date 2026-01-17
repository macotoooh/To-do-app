/**
 * Preserves intentionally thrown `Response` objects and converts
 * unexpected errors into a 500 Internal Server Error.
 *
 * @param err - An unknown error caught in a try/catch block.
 * @throws {Response}
 */
export const rethrowAsInternalError = (err: unknown): never => {
  if (err instanceof Response) {
    throw err;
  }

  throw new Response(null, {
    status: 500,
    statusText: "Internal Server Error",
  });
};

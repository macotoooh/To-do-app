import type { ActionFunctionArgs } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

/**
 * Creates mock arguments for a React Router loader function.
 *
 * @testOnly
 *
 * This helper is designed for route tests and provides the minimum
 * required `LoaderFunctionArgs` shape to invoke loaders in isolation.
 *
 * @param args - Partial loader arguments to override (e.g. params)
 * @returns LoaderFunctionArgs for testing
 */
export const createLoaderArgs = (
  args: Partial<LoaderFunctionArgs>
): LoaderFunctionArgs => ({
  context: {},
  params: args.params ?? {},
  request: new Request("http://localhost"),
  unstable_pattern: "",
});

/**
 * Creates mock arguments for a React Router action function.
 *
 * @testOnly
 *
 * This helper allows action functions to be executed directly
 * in tests without a router runtime.
 *
 * @param request - Request object passed to the action
 * @param overrides - Optional overrides such as route params
 * @returns ActionFunctionArgs for testing
 */
export const createActionArgs = (
  request: Request,
  overrides?: Partial<Omit<ActionFunctionArgs, "request">>
): ActionFunctionArgs => ({
  request,
  params: overrides?.params ?? {},
  context: {},
  unstable_pattern: "",
});

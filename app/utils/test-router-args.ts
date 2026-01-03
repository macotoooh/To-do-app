import type { ActionFunctionArgs } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export const createLoaderArgs = (
  args: Partial<LoaderFunctionArgs>
): LoaderFunctionArgs => ({
  context: {},
  params: args.params ?? {},
  request: new Request("http://localhost"),
  unstable_pattern: "",
});

export const createActionArgs = (
  request: Request,
  overrides?: Partial<Omit<ActionFunctionArgs, "request">>
): ActionFunctionArgs => ({
  request,
  params: overrides?.params ?? {},
  context: {},
  unstable_pattern: "",
});

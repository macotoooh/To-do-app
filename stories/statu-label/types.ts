import type { STATUS_VARIANT } from "./constants";

export type StatusVariant =
  (typeof STATUS_VARIANT)[keyof typeof STATUS_VARIANT];

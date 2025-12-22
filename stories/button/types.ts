import type { BUTTON_VARIANT } from "./constants";

export type ButtonColorKey = keyof typeof BUTTON_VARIANT;

export type ButtonColorValue = (typeof BUTTON_VARIANT)[ButtonColorKey];

import type { SUMMARY_CARD_VARIANT } from "./constants";

export type SummaryCardVariant =
  (typeof SUMMARY_CARD_VARIANT)[keyof typeof SUMMARY_CARD_VARIANT];


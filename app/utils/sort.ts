import { SORT_OPTION } from "~/constants/sort";

type SortOption = (typeof SORT_OPTION)[keyof typeof SORT_OPTION];

/**
 * Type guard that checks whether a value is a valid SortOption.
 *
 * Useful when reading untrusted inputs such as URL query params.
 *
 * @param value - Unknown input value
 * @returns true if the value is one of SORT_OPTION
 */
export const isSortOption = (value: unknown): value is SortOption => {
  return (
    value === SORT_OPTION.CREATED_DESC ||
    value === SORT_OPTION.CREATED_ASC ||
    value === SORT_OPTION.TITLE_ASC ||
    value === SORT_OPTION.TITLE_DESC
  );
};

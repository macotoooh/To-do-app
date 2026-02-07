import { describe, expect, test } from "vitest";
import { SORT_OPTION } from "~/constants/sort";
import { isSortOption } from "./sort";

describe("isSortOption", () => {
  test.each([
    SORT_OPTION.CREATED_DESC,
    SORT_OPTION.CREATED_ASC,
    SORT_OPTION.TITLE_ASC,
    SORT_OPTION.TITLE_DESC,
  ])("returns true for %s", (sort) => {
    expect(isSortOption(sort)).toBe(true);
  });

  test.each(["invalid", "", undefined, null, 123, {}, []])(
    "returns false for invalid value: %p",
    (value) => {
      expect(isSortOption(value)).toBe(false);
    },
  );
});


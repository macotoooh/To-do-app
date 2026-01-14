import { describe, test, expect } from "vitest";
import { getHeaderTitle } from "./route-labels";
import { ROUTE } from "~/constants/routes";

describe("getHeaderTitle", () => {
  test.each`
    input              | expected
    ${"/todos"}        | ${ROUTE.TODO_LIST}
    ${"/todos/new"}    | ${ROUTE.CREATE_TODO}
    ${"/todos/1"}      | ${ROUTE.TODO_DETAIL}
    ${""}              | ${""}
    ${"/invalid/path"} | ${""}
  `("returns $expected for input $input", ({ input, expected }) => {
    expect(getHeaderTitle(input)).toBe(expected);
  });
});

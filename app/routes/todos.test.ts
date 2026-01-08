import { describe, test, vi, beforeEach, expect } from "vitest";
import { loader } from "./todos";
import { createLoaderArgs } from "~/utils/test-router-args";
import { ROUTE } from "~/constants/routes";

describe("todos loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loader - headerTitle resolution", () => {
    test.each([
      {
        input: new Request("http://localhost/todos"),
        expected: ROUTE.TODO_LIST,
      },
      {
        input: new Request("http://localhost/todos/new"),
        expected: ROUTE.CREATE_TODO,
      },
      {
        input: new Request("http://localhost/todos/1"),
        expected: ROUTE.TODO_DETAIL,
      },
      { input: new Request("http://localhost/"), expected: "" },
      { input: new Request("http://localhost/invalid/path"), expected: "" },
    ])(
      "returns $expected for input $input.url",
      async ({ input, expected }) => {
        const result = await loader(createLoaderArgs({ request: input }));
        expect(result).toEqual({ headerTitle: expected });
      }
    );
  });
});

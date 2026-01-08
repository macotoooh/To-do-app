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

  describe("todos loader - headerTitle + isTodoListPage + isCreatePage", () => {
    test.each([
      {
        input: new Request("http://localhost/todos"),
        expected: {
          headerTitle: ROUTE.TODO_LIST,
          isTodoListPage: true,
          isCreatePage: false,
        },
      },
      {
        input: new Request("http://localhost/todos/new"),
        expected: {
          headerTitle: ROUTE.CREATE_TODO,
          isTodoListPage: false,
          isCreatePage: true,
        },
      },
      {
        input: new Request("http://localhost/todos/1"),
        expected: {
          headerTitle: ROUTE.TODO_DETAIL,
          isTodoListPage: false,
          isCreatePage: false,
        },
      },
      {
        input: new Request("http://localhost/invalid"),
        expected: {
          headerTitle: "",
          isTodoListPage: false,
          isCreatePage: false,
        },
      },
    ])("returns correct values for $input.url", async ({ input, expected }) => {
      const result = await loader(createLoaderArgs({ request: input }));
      expect(result).toEqual(expected);
    });
  });
});

import { describe, test, expect } from "vitest";
import { requireString } from "./form";

describe("requireString", () => {
  test("returns the value when a valid string is provided", () => {
    const result = requireString("hello", "title");
    expect(result).toBe("hello");
  });

  test("throws a 400 Response when value is null", () => {
    try {
      requireString(null, "title");
    } catch (err) {
      expect(err).toBeInstanceOf(Response);
      const response = err as Response;
      expect(response.status).toBe(400);
    }
  });

  test("throws a 400 Response when value is not a string", () => {
    const file = new File(["content"], "test.txt");

    try {
      requireString(file, "title");
    } catch (err) {
      expect(err).toBeInstanceOf(Response);
      const response = err as Response;
      expect(response.status).toBe(400);
    }
  });

  test("throws a 400 Response when value is an empty string", () => {
    try {
      requireString("", "title");
    } catch (err) {
      expect(err).toBeInstanceOf(Response);
      const response = err as Response;
      expect(response.status).toBe(400);
    }
  });
});

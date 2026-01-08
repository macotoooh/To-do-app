import { describe, test, expect } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  test("formats Date to yyyy/MM/dd HH:mm", () => {
    expect(formatDate(new Date("2026/01/03/12:00"))).toBe("2026/01/03 12:00");
  });
});

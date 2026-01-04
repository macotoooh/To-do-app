import { describe, test, expect } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  test("formats ISO date string to yyyy/MM/dd HH:mm", () => {
    expect(formatDate("2026-01-03T12:00:00.000Z")).toBe("2026/01/03 04:00");
  });

  test("formats ISO date string to yyyy/MM/dd with pattern params", () => {
    expect(formatDate("2026-01-03T12:00:00.000Z", "yyyy/MM/dd")).toBe(
      "2026/01/03"
    );
  });
});

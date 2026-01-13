import { deleteTaskById } from "./delete-task-by-id";

describe("deleteTaskById", () => {
  test("returns true when task exists", async () => {
    const result = await deleteTaskById("1");
    expect(result).toBe(true);
  });

  test("returns false when task does not exist", async () => {
    const result = await deleteTaskById("999");
    expect(result).toBe(false);
  });
});

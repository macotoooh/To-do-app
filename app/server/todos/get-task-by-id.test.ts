import { getTaskById } from "./get-task-by-id";

describe("getTaskById", () => {
  test("returns the correct task when it exists", async () => {
    const task = await getTaskById("1");
    expect(task).not.toBeNull();
    expect(task?.id).toBe("1");
  });

  test("returns null when task does not exist", async () => {
    const task = await getTaskById("999");
    expect(task).toBeNull();
  });
});

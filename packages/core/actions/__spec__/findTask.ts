import { describe, expect, it } from "vitest"
import { TestTask } from "../../fixtures/TestTask.ts"
import { findTask } from "../findTask.ts"

class IdentifiableTask extends TestTask<{ value: string }> {
  constructor(
    public override name: string,
    public id: string,
  ) {
    super(name)
  }
}

describe("findTask", () => {
  const tasks = {
    task1: new IdentifiableTask("task-one", "1"),
    task2: new IdentifiableTask("task-two", "2"),
    task3: new IdentifiableTask("task-three", "3"),
  }

  it("should find a task by name", () => {
    const foundTask = findTask(tasks, task => task.name === "task-two")
    expect(foundTask).toBe(tasks.task2)
  })

  it("should find a task by id", () => {
    const foundTask = findTask(tasks, task => task.id === "3")
    expect(foundTask).toBe(tasks.task3)
  })

  it("should find a task by custom predicate", () => {
    const foundTask = findTask(
      tasks,
      task => task.name.includes("one") && task.id === "1",
    )
    expect(foundTask).toBe(tasks.task1)
  })

  it("should throw error when no task matches predicate", () => {
    expect(() => findTask(tasks, task => task.name === "non-existent")).toThrow(
      "Task not found",
    )
  })

  it("should handle empty tasks object", () => {
    expect(() => findTask({}, () => true)).toThrow("Task not found")
  })
})

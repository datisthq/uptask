import { describe, expect, it, vi } from "vitest"
import type { ILogger } from "../../models/logger.ts"
import { Task } from "../../models/task.ts"
import { findTask } from "../findTask.ts"

class TestTask extends Task<{ value: string }> {
  constructor(
    public override name: string,
    public id: string,
  ) {
    super()
  }

  createLogger(): ILogger {
    return {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
      child: vi.fn(),
    }
  }

  async makeComplete(): Promise<void> {
    return Promise.resolve()
  }
}

describe("findTask", () => {
  const tasks = {
    task1: new TestTask("task-one", "1"),
    task2: new TestTask("task-two", "2"),
    task3: new TestTask("task-three", "3"),
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

import { describe, expect, it, vi } from "vitest"
import type { ILogger } from "../../models/logger.ts"
import { Task } from "../../models/task.ts"
import { createTasks } from "../createTasks.ts"

class FirstTask extends Task {
  name = "first-task"

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

class SecondTask extends Task<{ value: string }> {
  name = "second-task"

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

class ThirdTask extends Task {
  name = "third-task"

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

describe("createTasks", () => {
  it("should create tasks from task classes", () => {
    const tasks = createTasks([FirstTask, SecondTask])

    expect(Object.keys(tasks)).toHaveLength(2)
    expect(tasks["first-task"]).toBeInstanceOf(FirstTask)
    expect(tasks["second-task"]).toBeInstanceOf(SecondTask)
  })

  it("should create an empty object when no task classes are provided", () => {
    const tasks = createTasks([])

    expect(Object.keys(tasks)).toHaveLength(0)
    expect(tasks).toEqual({})
  })

  it("should use task names as keys", () => {
    const tasks = createTasks([FirstTask, SecondTask, ThirdTask])

    expect(Object.keys(tasks)).toEqual([
      "first-task",
      "second-task",
      "third-task",
    ])
  })

  it("should maintain individual task instances", () => {
    const tasks = createTasks([FirstTask, SecondTask])
    const secondTask = tasks["second-task"]

    // TypeScript narrowing to ensure tasks["second-task"] is defined
    if (secondTask) {
      secondTask.updateConfig({ value: "test" })

      expect(secondTask.config).toEqual({ value: "test" })
      expect(tasks["first-task"]?.config).toEqual({})
    } else {
      // This will fail the test if the task doesn't exist
      expect(secondTask).toBeDefined()
    }
  })
})

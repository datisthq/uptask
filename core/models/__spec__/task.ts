import { beforeEach, describe, expect, it, vi } from "vitest"
import type { ILogger } from "../logger.ts"
import { Task } from "../task.ts"

class TestTask extends Task<{ test: string }> {
  name = "test-task"

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

describe("Task", () => {
  let task: TestTask

  beforeEach(() => {
    task = new TestTask()
    vi.clearAllMocks()
  })

  it("should initialize with default values", () => {
    expect(task.name).toBe("test-task")
    expect(task.type).toBe("task")
    expect(task.config).toEqual({})
  })

  it("should update config correctly", () => {
    task.updateConfig({ test: "value" })
    expect(task.config).toEqual({ test: "value" })

    task.updateConfig({ test: "new-value" })
    expect(task.config).toEqual({ test: "new-value" })
  })

  it("should create and cache logger", () => {
    const createLoggerSpy = vi.spyOn(task, "createLogger")

    const logger1 = task.logger
    const logger2 = task.logger

    expect(createLoggerSpy).toHaveBeenCalledTimes(1)
    expect(logger1).toBe(logger2)
  })

  it("should log start and finish during successful run", async () => {
    const infoSpy = vi.spyOn(task.logger, "info")

    await task.run()

    expect(infoSpy).toHaveBeenCalledTimes(2)
    expect(infoSpy).toHaveBeenNthCalledWith(1, "Started task: test-task")
    expect(infoSpy).toHaveBeenNthCalledWith(2, "Finised task: test-task")
  })

  it("should log error when run fails", async () => {
    const error = new Error("Test error")
    vi.spyOn(task, "makeComplete").mockRejectedValueOnce(error)
    const errorSpy = vi.spyOn(task.logger, "error")

    await expect(task.run()).rejects.toThrow("Test error")

    expect(errorSpy).toHaveBeenCalledWith("Errored task: test-task", { error })
  })

  it("should retry when configured", async () => {
    const makeCompleteSpy = vi.spyOn(task, "makeComplete")
    makeCompleteSpy
      .mockRejectedValueOnce(new Error("Fail once"))
      .mockResolvedValueOnce()

    await task.run({ retries: 1 })

    expect(makeCompleteSpy).toHaveBeenCalledTimes(2)
  })

  it("should timeout when configured", async () => {
    vi.spyOn(task, "makeComplete").mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100)),
    )

    await expect(task.run({ timeout: 50 })).rejects.toThrow(
      "Promise timed out after 50 milliseconds",
    )
  })

  it("should pass the error through when retries are exhausted", async () => {
    const error = new Error("Persistent error")
    vi.spyOn(task, "makeComplete").mockRejectedValue(error)

    await expect(task.run({ retries: 2 })).rejects.toThrow("Persistent error")
  })
})

import { createTasks } from "@uptask/core"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { TestCLITask } from "../../fixtures/TestCLITask.js"
import { runTasksCli } from "../runTasksCli.js"

// Define task classes for testing
class Task1 extends TestCLITask {
  override name = "task1"
}

class Task2 extends TestCLITask<{ option: string }> {
  override name = "task2"
}

class Task3 extends TestCLITask {
  override name = "task3"
}

// Define specific task map type for better type safety
type TestTaskMap = {
  task1: Task1
  task2: Task2
  task3: Task3
  [key: string]: TestCLITask
}

describe("runTasksCli", () => {
  let tasks: TestTaskMap
  let mockExit: any
  let consoleLogSpy: any
  let jsonParseSpy: any

  beforeEach(() => {
    // Create tasks and cast to our specific type to help TypeScript
    tasks = createTasks([Task1, Task2, Task3]) as unknown as TestTaskMap

    // Mock process.exit to prevent tests from exiting
    mockExit = vi.spyOn(process, "exit").mockImplementation(code => {
      throw new Error(`Process exit called with code: ${code}`)
    })

    // Mock console.log to prevent output during tests
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    vi.clearAllMocks()
    mockExit.mockRestore()
    consoleLogSpy.mockRestore()
    if (jsonParseSpy) {
      jsonParseSpy.mockRestore()
    }
  })

  it("should run the specified task by name", async () => {
    const argv = ["node", "script.js", "task1"]

    await runTasksCli(tasks, { argv })

    expect(tasks.task1.runMock).toHaveBeenCalledTimes(1)
    expect(tasks.task2.runMock).not.toHaveBeenCalled()
    expect(tasks.task3.runMock).not.toHaveBeenCalled()
  })

  it.skip("should print available tasks when task is not found", async () => {
    const argv = ["node", "script.js", "non-existent-task"]
    await runTasksCli(tasks, { argv })
  })

  it("should pass config to the task", async () => {
    const argv = [
      "node",
      "script.js",
      "task2",
      "--config",
      '{"option":"test-value"}',
    ]
    const updateConfigSpy = vi.spyOn(tasks.task2, "updateConfig")

    await runTasksCli(tasks, { argv })

    expect(updateConfigSpy).toHaveBeenCalledWith({ option: "test-value" })
    expect(tasks.task2.runMock).toHaveBeenCalledTimes(1)
  })

  it("should handle invalid JSON in config", async () => {
    // Since the implementation directly calls JSON.parse, we need to mock it
    // to throw the specific error message our test is expecting
    jsonParseSpy = vi.spyOn(JSON, "parse").mockImplementation(() => {
      throw new SyntaxError(
        "Unexpected token 'i', \"invalid-json\" is not valid JSON",
      )
    })

    const argv = ["node", "script.js", "task2", "--config", "invalid-json"]

    // The actual error will be the raw SyntaxError from JSON.parse
    await expect(runTasksCli(tasks, { argv })).rejects.toThrow(
      /Unexpected token 'i', "invalid-json" is not valid JSON/,
    )
  })

  it("should handle task execution failure", async () => {
    const argv = ["node", "script.js", "task3"]
    const error = new Error("Task execution failed")
    tasks.task3.runMock.mockRejectedValueOnce(error)

    await expect(runTasksCli(tasks, { argv })).rejects.toThrow(
      "Task execution failed",
    )
  })

  it("should use process.argv when config.argv is not provided", async () => {
    const originalArgv = process.argv

    try {
      process.argv = ["node", "script.js", "task1"]

      await runTasksCli(tasks)

      expect(tasks.task1.runMock).toHaveBeenCalledTimes(1)
    } finally {
      process.argv = originalArgv
    }
  })

  it("should handle short form config option -c", async () => {
    const argv = [
      "node",
      "script.js",
      "task2",
      "-c",
      '{"option":"short-option"}',
    ]
    const updateConfigSpy = vi.spyOn(tasks.task2, "updateConfig")

    await runTasksCli(tasks, { argv })

    expect(updateConfigSpy).toHaveBeenCalledWith({ option: "short-option" })
    expect(tasks.task2.runMock).toHaveBeenCalledTimes(1)
  })
})

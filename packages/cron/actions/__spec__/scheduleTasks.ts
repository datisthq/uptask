import { type Task, createTasks } from "@uptask/core"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { TestTask } from "../../../core/fixtures/TestTask.js"
import { scheduleTasks } from "../scheduleTasks.js"

// Mock the cron library
vi.mock("cron", () => {
  const mockStartFn = vi.fn()
  const mockFromFn = vi.fn(() => ({
    start: mockStartFn,
  }))

  return {
    CronJob: {
      from: mockFromFn,
    },
  }
})

// Import mocks after they've been set up
import { CronJob } from "cron"

// Define task classes for scheduling
class DailyTask extends TestTask {
  override name = "daily-task"
}

class HourlyTask extends TestTask {
  override name = "hourly-task"
}

class WeeklyTask extends TestTask {
  override name = "weekly-task"
}

// Define specific task map type
type TestScheduleMap = {
  [cronExpression: string]: Task
}

describe("scheduleTasks", () => {
  let schedule: TestScheduleMap

  beforeEach(() => {
    // Create tasks with explicit casting to handle the typing issue
    const tasksObj = createTasks([DailyTask, HourlyTask, WeeklyTask])

    // Create the schedule with explicit typing
    schedule = {
      "0 0 * * *": tasksObj["daily-task"] as Task, // daily at midnight
      "0 * * * *": tasksObj["hourly-task"] as Task, // hourly
      "0 0 * * 0": tasksObj["weekly-task"] as Task, // weekly on Sunday
    }

    // Clear mocks between tests
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it("should create a cron job for each scheduled task", async () => {
    await scheduleTasks(schedule, {})

    // Verify the CronJob.from was called for each scheduled task
    expect(CronJob.from).toHaveBeenCalledTimes(3)
  })

  it("should pass cron expression as cronTime", async () => {
    await scheduleTasks(schedule, {})

    // Verify the first call to CronJob.from had the correct cronTime
    expect(CronJob.from).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cronTime: "0 0 * * *" }),
    )

    // Verify the second call to CronJob.from had the correct cronTime
    expect(CronJob.from).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cronTime: "0 * * * *" }),
    )

    // Verify the third call to CronJob.from had the correct cronTime
    expect(CronJob.from).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ cronTime: "0 0 * * 0" }),
    )
  })

  it("should set task run method as onTick", async () => {
    await scheduleTasks(schedule, {})

    // Check that each call includes the task's run method
    for (let i = 0; i < 3; i++) {
      const call = (CronJob.from as any).mock.calls[i][0]
      expect(call).toHaveProperty("onTick")
      expect(typeof call.onTick).toBe("function")
    }
  })

  it("should pass additional config to the cron job", async () => {
    const config = {
      timeZone: "America/New_York",
      runOnInit: true,
    }

    await scheduleTasks(schedule, config)

    // Verify all additional config was passed through
    expect(CronJob.from).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        timeZone: "America/New_York",
        runOnInit: true,
      }),
    )
  })

  it("should start each cron job", async () => {
    const mockStart = vi.fn()
    ;(CronJob.from as any).mockReturnValue({ start: mockStart })

    await scheduleTasks(schedule, {})

    // Verify start was called for each job
    expect(mockStart).toHaveBeenCalledTimes(3)
  })
})

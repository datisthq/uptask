import type { Task } from "@uptask/core"
import { CronJob } from "cron"
import { objectEntries } from "ts-extras"

/**
 * Schedules tasks to run according to cron expressions.
 *
 * This function sets up cron jobs for each specified task, using the provided
 * cron expression as the schedule. Additional cron configuration can be passed
 * to all jobs.
 *
 * @param schedule - Map of cron expressions to tasks
 * @param config - Additional configuration for the cron jobs
 * @returns A promise that resolves when all schedules are set up
 *
 * @example
 * ```typescript
 * const tasks = createTasks([DailyTask, HourlyTask])
 *
 * await scheduleTasks({
 *   // Run daily at midnight
 *   "0 0 * * *": tasks.dailyTask,
 *
 *   // Run every hour
 *   "0 * * * *": tasks.hourlyTask
 * }, {
 *   // Additional cron configuration
 *   timeZone: "America/New_York",
 *   runOnInit: true
 * })
 * ```
 */
export async function scheduleTasks(
  schedule: Record<string, Task>,
  config?: Record<string, any>,
) {
  for (const [time, task] of objectEntries(schedule)) {
    const job = CronJob.from({ ...config, cronTime: time, onTick: task.run })
    job.start()
  }
}

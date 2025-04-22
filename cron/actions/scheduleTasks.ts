import type { Task } from "@uptask/core"
import { CronJob } from "cron"
import { objectEntries } from "ts-extras"

/**
 * Schedules tasks to run according to cron expressions.
 */
export async function scheduleTasks(
  schedule: Record<string, Task>,
  config?: Record<string, any>,
) {
  for (const [time, task] of objectEntries(schedule)) {
    const job = CronJob.from({
      ...config,
      cronTime: time,
      onTick: task.run.bind(task),
    })
    job.start()
  }
}

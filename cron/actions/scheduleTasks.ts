import { CronJob } from "cron"
import type { Task } from "@uptask/core"
import { objectEntries } from "ts-extras"

export async function scheduleTasks(
  schedule: Record<string, Task>,
  config: Record<string, any>,
) {
  for (const [time, task] of objectEntries(schedule)) {
    const job = CronJob.from({ ...config, cronTime: time, onTick: task.run })
    job.start()
  }
}

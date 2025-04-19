import { objectEntries } from "ts-extras"
import type { Task } from "../models/task.ts"

export function findTask<T extends Task>(
  tasks: Record<string, T>,
  predicate: (task: T) => boolean,
) {
  const task = objectEntries(tasks)
    .map(([_, task]) => task)
    .find(task => predicate(task))

  if (!task) {
    throw new Error("Task not found")
  }

  return task
}

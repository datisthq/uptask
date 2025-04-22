import { objectEntries } from "ts-extras"
import type { Task } from "../models/task.js"

/**
 * Finds a task in a task registry that matches the given predicate.
 */
export function findTask<T extends Task>(
  tasks: Record<string, T>,
  predicate: (task: T) => boolean,
) {
  const task = objectEntries(tasks)
    .map(([_, task]) => task)
    .find(task => predicate(task))

  return task
}

import { objectEntries } from "ts-extras"
import type { Task } from "../models/task.ts"

/**
 * Finds a task in a task registry that matches the given predicate.
 *
 * @template T - Type of task extending the Task base class
 * @param tasks - Map of task names to task instances
 * @param predicate - Function that returns true for the task to find
 * @returns The first task that matches the predicate
 * @throws Error if no task matches the predicate
 *
 * @example
 * ```typescript
 * // Find a task by name
 * const myTask = findTask(tasks, task => task.name === "myTask")
 *
 * // Find a task by a custom property
 * const configuredTask = findTask(tasks, task => task.config.someProp === "value")
 * ```
 */
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

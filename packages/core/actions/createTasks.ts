import type { Task } from "../models/task.js"

/**
 * Type representing a class that constructs a Task
 */
type TaskClass = new () => Task

/**
 * Type that maps from task names to their specific task instance types
 * @template T - Array of task instances
 */
type TaskMap<T extends Task[]> = {
  [K in T[number]["name"]]: Extract<T[number], { name: K }>
}

/**
 * Creates a map of tasks from an array of task classes.
 *
 * This function instantiates each task class and creates a map
 * where the keys are the task names and the values are the task instances.
 * It provides type safety by preserving the specific type of each task.
 *
 * @template T - Array of task class types
 * @param Tasks - Array of task classes to instantiate
 * @returns A map of task names to task instances with correct typing
 *
 * @example
 * ```typescript
 * class MyTask extends Task {
 *   name = "myTask"
 *   // ...implementation
 * }
 *
 * class OtherTask extends Task {
 *   name = "otherTask"
 *   // ...implementation
 * }
 *
 * const tasks = createTasks([MyTask, OtherTask])
 * // tasks.myTask is strongly typed as MyTask
 * // tasks.otherTask is strongly typed as OtherTask
 * ```
 */
export function createTasks<T extends TaskClass[]>(Tasks: T) {
  const taskList = Tasks.map(Task => new Task())
  return Object.fromEntries(taskList.map(task => [task.name, task])) as TaskMap<
    InstanceType<T[number]>[]
  >
}

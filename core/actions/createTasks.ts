import type { Task } from "../models/task.js"

/**
 * Type representing a class that constructs a Task
 */
type TaskClass = new () => Task

/**
 * Type that maps from task names to their specific task instance types
 */
type TaskMap<T extends Task[]> = {
  [K in T[number]["name"]]: Extract<T[number], { name: K }>
}

/**
 * Creates a map of tasks from an array of task classes.
 */
export function createTasks<T extends TaskClass[]>(Tasks: T) {
  const taskList = Tasks.map(Task => new Task())
  return Object.fromEntries(taskList.map(task => [task.name, task])) as TaskMap<
    InstanceType<T[number]>[]
  >
}

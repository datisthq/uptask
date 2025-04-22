import type { Task } from "../models/task.js"

export function printTasks(tasks: Record<string, Task>) {
  Object.values(tasks).forEach(task => console.log(task.name))
}

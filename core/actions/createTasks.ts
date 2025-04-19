import type { Task } from "../models/task.ts"

type TaskClass = new () => Task
type TaskMap<T extends Task[]> = {
  [K in T[number]["name"]]: Extract<T[number], { name: K }>
}

export function createTasks<T extends TaskClass[]>(Tasks: T) {
  const taskList = Tasks.map(Task => new Task())
  return Object.fromEntries(taskList.map(task => [task.name, task])) as TaskMap<
    InstanceType<T[number]>[]
  >
}

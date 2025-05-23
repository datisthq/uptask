import { describe, expect, it } from "vitest"
import { TestTask } from "../../fixtures/TestTask.js"
import { findTask } from "../findTask.js"

// Define a task with an ID property for testing the findTask function
class IdentifiableTask extends TestTask<{ value: string }> {
  id: string

  constructor(name: string, id: string) {
    super(name)
    this.id = id
  }
}

describe("findTask", () => {
  const tasks = {
    task1: new IdentifiableTask("task-one", "1"),
    task2: new IdentifiableTask("task-two", "2"),
    task3: new IdentifiableTask("task-three", "3"),
  }

  it("should find a task by name", () => {
    const foundTask = findTask(tasks, task => task.name === "task-two")
    expect(foundTask).toBe(tasks.task2)
  })

  it("should find a task by id", () => {
    const foundTask = findTask(tasks, task => task.id === "3")
    expect(foundTask).toBe(tasks.task3)
  })

  it("should find a task by custom predicate", () => {
    const foundTask = findTask(
      tasks,
      task => task.name.includes("one") && task.id === "1",
    )
    expect(foundTask).toBe(tasks.task1)
  })

  it("should throw error when no task matches predicate", () => {
    const foundTask = findTask(tasks, task => task.name === "non-existent")
    expect(foundTask).toBeUndefined()
  })

  it("should handle empty tasks object", () => {
    const foundTask = findTask({}, () => true)
    expect(foundTask).toBeUndefined()
  })
})

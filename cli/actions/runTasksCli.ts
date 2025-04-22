import { type Task, findTask } from "@uptask/core"
import { Command } from "commander"

/**
 * Runs a task from the command line interface.
 */
export async function runTasksCli(
  tasks: Record<string, Task>,
  config?: { argv?: string[] },
) {
  const argv = config?.argv ?? process.argv

  const program = new Command()
    .name("task")
    .description("Run a task")
    .argument("[name]", "Task name")
    .option("-c, --config <string>", "Task config")
    .parse(argv)

  const name = program.args[0]
  const options = program.opts()

  if (!name) {
    Object.values(tasks).forEach(task => console.log(task.name))
    process.exit(0)
  }

  const task = findTask(tasks, task => task.name === name)
  if (!task) {
    Object.values(tasks).forEach(task => console.log(task.name))
    process.exit(1)
  }

  if (options.config) task.updateConfig(JSON.parse(options.config))
  await task.run()
}

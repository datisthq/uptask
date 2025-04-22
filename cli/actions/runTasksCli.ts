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

  const [name] = program.args
  if (!name) {
    Object.keys(tasks).forEach(name => console.log(name))
    process.exit(0)
  }

  const task = findTask(tasks, task => task.name === name)
  if (!task) {
    Object.keys(tasks).forEach(name => console.log(name))
    process.exit(1)
  }

  const options = program.opts()
  if (options.config) task.updateConfig(JSON.parse(options.config))
  await task.run()
}

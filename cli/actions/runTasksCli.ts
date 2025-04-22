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

  program
    .name("task")
    .description("Run a task")
    .argument("[name]", "Task name")
    .option("-c, --config <string>", "Task config")
    .action(async (name, options) => {
      if (!name) {
        Object.keys(tasks).forEach(console.log)
        process.exit(0)
      }

      const task = findTask(tasks, task => task.name === name)
      if (!task) {
        Object.keys(tasks).forEach(console.log)
        process.exit(1)
      }

      if (options.config) task.updateConfig(JSON.parse(options.config))
      await task.run()
    })

  await program.parseAsync(argv)
}

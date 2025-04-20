import { type Task, findTask } from "@uptask/core"
import { Command } from "commander"

/**
 * Runs a task from the command line interface.
 *
 * This function sets up a CLI using Commander.js that allows running any task
 * from the provided task registry. It supports passing configuration as a JSON string.
 *
 * @param tasks - Map of task names to task instances
 * @param config - Optional configuration for the CLI
 * @param config.argv - Optional array of command line arguments (defaults to process.argv)
 * @returns A promise that resolves when the CLI execution completes
 * @throws If the task is not found or if there's an error executing the task
 *
 * @example
 * ```typescript
 * // In your CLI entry point:
 * const tasks = createTasks([MyTask, OtherTask])
 * await runTasksCli(tasks)
 *
 * // Command line usage:
 * // $ node script.js my-task --config '{"key":"value"}'
 * ```
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
    .argument("<n>", "Task name")
    .option("-c, --config <string>", "Task config")
    .action(async (name, options) => {
      const task = findTask(tasks, task => task.name === name)

      if (!task) {
        for (const name of Object.keys(tasks)) console.log(name)
        return
      }

      if (options.config) task.updateConfig(JSON.parse(options.config))
      await task.run()
    })

  await program.parseAsync(argv)
}

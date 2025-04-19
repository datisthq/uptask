import { type Task, findTask } from "@uptask/core"
import { Command } from "commander"

export async function runTaskInCli(
  tasks: Record<string, Task>,
  props: { argv: string[] },
) {
  const program = new Command()

  program
    .name("task")
    .description("Run a task")
    .argument("<name>", "Task name")
    .option("-c, --config <string>", "Task config")
    .action(async (name, options) => {
      const task = findTask(tasks, task => task.name === name)
      if (options.config) task.updateConfig(JSON.parse(options.config))
      await task.run()
    })

  await program.parseAsync(props.argv)
}

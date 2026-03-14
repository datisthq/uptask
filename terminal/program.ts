import { Command } from "commander"
import { createCommand } from "./actions/command/create.ts"
import { loadConfig } from "./actions/config/load.ts"
import { parseFunctions } from "./actions/function/parse.ts"
import { searchModules } from "./actions/module/search.ts"
import { helpConfiguration } from "./helpers/program.ts"

/**
 * Build a Commander program by discovering files and registering their functions.
 */
export async function createProgram() {
  const configIndex = process.argv.findIndex(
    a => a === "-c" || a === "--config",
  )
  const configPath =
    configIndex !== -1 ? process.argv[configIndex + 1] : undefined
  const config = await loadConfig(configPath)

  const program = new Command()
    .name(config.name)
    .description(config.description)
    .version(config.version)
    .option("-c, --config <path>", "Path to config file")
    .configureHelp(helpConfiguration)

  const modules = searchModules(config.pattern)
  for (const mod of modules) {
    for (const func of parseFunctions(mod)) {
      program.addCommand(createCommand(func))
    }
  }

  config.setupProgram?.(program)

  return program
}

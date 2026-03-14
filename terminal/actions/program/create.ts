import { Command } from "commander"
import { helpConfiguration } from "../../helpers/program.ts"
import type { Config } from "../../models/config.ts"
import { createCommand } from "../command/create.ts"
import { parseFunctions } from "../function/parse.ts"
import { searchModules } from "../module/search.ts"

/**
 * Build a Commander program from a validated config.
 */
export function createProgram(config: Config) {
  const program = new Command()
    .name(config.name)
    .description(config.description)
    .version(config.version)
    .configureHelp(helpConfiguration)

  const modules = searchModules(config.pattern)
  for (const mod of modules) {
    for (const func of parseFunctions(mod)) {
      program.addCommand(createCommand(func))
    }
  }

  if (config.setupProgram) {
    config.setupProgram(program)
  }

  return program
}

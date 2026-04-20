import { Command } from "commander"
import { helpConfiguration } from "../../helpers/program.ts"
import type { Config } from "../../models/config.ts"
import { MAX_MODULES } from "../../settings.ts"
import { createCommand } from "../command/create.ts"
import { groupModules } from "../module/group.ts"
import { parseModules } from "../module/parse.ts"
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
  if (modules.length > MAX_MODULES) {
    throw new Error(
      `Discovered ${modules.length} task modules, which exceeds the limit of ${MAX_MODULES}. Narrow config.pattern to reduce the set.`,
    )
  }
  const { groups, ungrouped } = groupModules(modules, config.groups)

  for (const func of parseModules(ungrouped)) {
    program.addCommand(createCommand(func))
  }

  for (const group of groups) {
    if (!group.modules.length) continue
    const parent = new Command(group.name).configureHelp(helpConfiguration)
    for (const func of parseModules(group.modules)) {
      parent.addCommand(createCommand(func))
    }
    program.addCommand(parent)
  }

  if (config.setupProgram) {
    config.setupProgram(program)
  }

  return program
}

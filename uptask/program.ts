import { Command } from "commander"
import { createCommand } from "./actions/command/create.ts"
import { parseFile } from "./actions/file/parse.ts"
import { searchModules } from "./actions/module/search.ts"
import { helpConfiguration } from "./helpers/program.ts"
import packageJson from "./package.json" with { type: "json" }

/**
 * Build a Commander program by discovering files and registering their functions
 **/
export function createProgram(pattern?: string): Command {
  const program = new Command()
    .name("uptask")
    .description(packageJson.description)
    .version(packageJson.version)
    .configureHelp(helpConfiguration)

  const modules = searchModules(pattern)
  for (const mod of modules) {
    for (const func of parseFile(mod.path)) {
      program.addCommand(createCommand(func))
    }
  }

  return program
}

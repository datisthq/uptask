import { Command } from "commander"
import { createCommand } from "./actions/command/create.ts"
import { parseFile } from "./actions/file/parse.ts"
import { searchPaths } from "./actions/path/search.ts"
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

  const paths = searchPaths(pattern)
  for (const path of paths) {
    const file = parseFile(path)
    for (const func of file.functions) {
      program.addCommand(createCommand(file, func))
    }
  }

  return program
}

import { Command } from "commander"
import { helpConfiguration } from "../../helpers/program.ts"
import type { File } from "../../models/file.ts"
import type { Function } from "../../models/function.ts"

/**
 * Create a Commander command from a Function, wiring options to dynamic import and execution.
 */
export function createCommand(file: File, func: Function): Command {
  const cmd = new Command(func.name).configureHelp(helpConfiguration)
  if (func.description) cmd.description(func.description)

  for (const param of func.parameters) {
    const flag = camelToKebab(param.name)
    const description = param.description || ""

    if (param.type === "boolean") {
      cmd.option(`--${flag}`, description, param.default as boolean | undefined)
    } else if (param.type === "string[]" || param.type === "number[]") {
      const collect = (value: string, prev: unknown[]) => {
        prev.push(param.type === "number[]" ? Number(value) : value)
        return prev
      }
      const defaultVal = (param.default ?? []) as unknown[]
      if (param.required) {
        cmd.requiredOption(`--${flag} <value>`, description, collect, [])
      } else {
        cmd.option(`--${flag} <value>`, description, collect, defaultVal)
      }
    } else if (param.type === "number") {
      const parse = (v: string) => Number(v)
      if (param.required) {
        cmd.requiredOption(`--${flag} <value>`, description, parse)
      } else {
        cmd.option(`--${flag} <value>`, description, parse, param.default)
      }
    } else if (param.type === "object") {
      const parse = (v: string) => JSON.parse(v) as unknown
      if (param.required) {
        cmd.requiredOption(`--${flag} <value>`, description, parse)
      } else {
        cmd.option(`--${flag} <value>`, description, parse, param.default)
      }
    } else {
      if (param.required) {
        cmd.requiredOption(`--${flag} <value>`, description)
      } else {
        cmd.option(
          `--${flag} <value>`,
          description,
          param.default as string | undefined,
        )
      }
    }
  }

  cmd.action(async (options: Record<string, unknown>) => {
    const mod = (await import(file.path)) as Record<
      string,
      (...args: unknown[]) => unknown
    >
    const fn = mod[func.name]
    if (!fn) throw new Error(`Function ${func.name} not found in ${file.path}`)
    await fn(options)
  })

  return cmd
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
}

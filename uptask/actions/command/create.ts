import { Command } from "commander"
import { helpConfiguration } from "../../helpers/program.ts"
import type { Function } from "../../models/function.ts"
import type { Parameter } from "../../models/parameter.ts"

/**
 * Create a Commander command from a Function, wiring options to dynamic import and execution.
 */
export function createCommand(func: Function): Command {
  const cmd = new Command(func.name).configureHelp(helpConfiguration)
  if (func.description) cmd.description(func.description)

  const argumentParams: typeof func.parameters = []

  for (const param of func.parameters) {
    if (param.type === "string" || param.type === "number") {
      argumentParams.push(param)
      const bracket = param.required ? `<${param.name}>` : `[${param.name}]`
      cmd.argument(bracket, param.description || "")
    } else {
      registerOption(cmd, param)
    }
  }

  cmd.action(async (...actionArgs: unknown[]) => {
    const options = actionArgs.at(-2) as Record<string, unknown>
    const positionalValues = actionArgs.slice(0, argumentParams.length)
    const args = func.parameters.map(param => {
      const argIndex = argumentParams.indexOf(param)
      if (argIndex !== -1) {
        const val = positionalValues[argIndex]
        return param.type === "number" ? Number(val) : val
      }
      return options[param.name] ?? param.default
    })
    const mod = (await import(func.path)) as Record<
      string,
      (...args: unknown[]) => unknown
    >
    const fn = mod[func.name]
    if (!fn) throw new Error(`Function ${func.name} not found in ${func.path}`)
    await fn(...args)
  })

  return cmd
}

function registerOption(cmd: Command, param: Parameter) {
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
  } else if (param.type === "object") {
    const parse = (v: string) => JSON.parse(v) as unknown
    if (param.required) {
      cmd.requiredOption(`--${flag} <value>`, description, parse)
    } else {
      cmd.option(`--${flag} <value>`, description, parse, param.default)
    }
  }
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`)
}

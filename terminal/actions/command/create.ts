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
  let hasVariadic = false

  for (const [i, param] of func.parameters.entries()) {
    if (i === 0 && (param.type === "string[]" || param.type === "number[]")) {
      hasVariadic = true
      argumentParams.push(param)
      const bracket = param.required
        ? `<${param.name}...>`
        : `[${param.name}...]`
      cmd.argument(bracket, param.description || "")
    } else if (
      !hasVariadic &&
      (param.type === "string" || param.type === "number") &&
      param.required
    ) {
      argumentParams.push(param)
      cmd.argument(`<${param.name}>`, param.description || "")
    } else if (param.type === "object" && param.properties?.length) {
      for (const prop of param.properties) {
        registerOption(cmd, prop)
      }
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
        if (param.type === "number") return Number(val)
        if (param.type === "number[]")
          return (val as unknown[]).map(v => Number(v))
        return val
      }
      if (param.type === "object" && param.properties?.length) {
        return buildObject(param.properties, options)
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

function buildObject(
  properties: Parameter[],
  options: Record<string, unknown>,
): Record<string, unknown> {
  const obj: Record<string, unknown> = {}
  for (const prop of properties) {
    if (prop.type === "object" && prop.properties?.length) {
      obj[prop.name] = buildObject(prop.properties, options)
    } else {
      obj[prop.name] = options[prop.name] ?? prop.default
    }
  }
  return obj
}

function registerOption(cmd: Command, param: Parameter) {
  const flag = camelToKebab(param.name)
  const description = param.description || ""

  if (param.type === "string") {
    if (param.required) {
      cmd.requiredOption(`--${flag} <value>`, description)
    } else {
      cmd.option(`--${flag} <value>`, description, param.default as string)
    }
  } else if (param.type === "number") {
    if (param.required) {
      cmd.requiredOption(`--${flag} <value>`, description, Number)
    } else {
      cmd.option(
        `--${flag} <value>`,
        description,
        Number,
        param.default as number,
      )
    }
  } else if (param.type === "boolean") {
    cmd.option(`--${flag}`, description, param.default as boolean | undefined)
  } else if (param.type === "string[]") {
    if (param.required) {
      cmd.requiredOption(`--${flag} <value...>`, description)
    } else {
      const defaultVal = (param.default ?? []) as string[]
      cmd.option(`--${flag} <value...>`, description, defaultVal)
    }
  } else if (param.type === "number[]") {
    const coerce = (v: string, prev: number[] | undefined) => {
      const list = prev ?? []
      list.push(Number(v))
      return list
    }
    if (param.required) {
      cmd.requiredOption(`--${flag} <value...>`, description, coerce)
    } else {
      const defaultVal = (param.default ?? []) as number[]
      cmd.option(`--${flag} <value...>`, description, coerce, defaultVal)
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

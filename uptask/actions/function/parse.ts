import type { Function } from "../../models/function.ts"

/**
 * Match a command name from argv and parse its flags into typed values.
 */
export function parseFunction(
  funcs: Function[],
  argv: string[],
): { func: Function; args: Record<string, unknown> } {
  const commandName = argv[0]
  const func = funcs.find(f => f.name === commandName)
  if (!func) throw new Error(`Unknown command: ${commandName}`)

  const args: Record<string, unknown> = {}
  let i = 1
  while (i < argv.length) {
    const arg = argv[i]
    if (!arg) break
    if (!arg.startsWith("--")) {
      i++
      continue
    }

    const flagName = kebabToCamel(arg.slice(2))
    const param = func.parameters.find(p => p.name === flagName)
    if (!param) {
      i++
      continue
    }

    if (param.type === "boolean") {
      args[flagName] = true
      i++
      continue
    }

    const value = argv[i + 1]
    if (value === undefined) {
      i++
      continue
    }

    if (param.type === "string[]" || param.type === "number[]") {
      const existing = (args[flagName] as unknown[] | undefined) ?? []
      existing.push(param.type === "number[]" ? Number(value) : value)
      args[flagName] = existing
      i += 2
      continue
    }

    if (param.type === "number") {
      args[flagName] = Number(value)
    } else if (param.type === "object") {
      args[flagName] = JSON.parse(value)
    } else {
      args[flagName] = value
    }
    i += 2
  }

  for (const param of func.parameters) {
    if (args[param.name] === undefined && param.default !== undefined) {
      args[param.name] = param.default
    }
  }

  return { func, args }
}

function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

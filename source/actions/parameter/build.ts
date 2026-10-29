import { z } from "zod"
import type { Parameter } from "../../models/parameter.ts"

/**
 * Build a zod schema validating a CLI-derived value against a Parameter's shape.
 * Recurses through object properties so decomposed and JSON object inputs are
 * both covered.
 */
export function buildSchema(parameter: Parameter): z.ZodType {
  const base = baseSchema(parameter)
  return parameter.required ? base : base.optional()
}

function baseSchema(parameter: Parameter): z.ZodType {
  if (parameter.type === "string") return z.string()
  if (parameter.type === "number") return z.number()
  if (parameter.type === "boolean") return z.boolean()
  if (parameter.type === "string[]") return z.array(z.string())
  if (parameter.type === "number[]") return z.array(z.number())
  if (parameter.properties?.length) {
    const shape = Object.fromEntries(
      parameter.properties.map(p => [p.name, buildSchema(p)]),
    )
    return z.object(shape)
  }
  return z.record(z.string(), z.unknown())
}

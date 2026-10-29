import { z } from "zod"

/**
 * Supported parameter types mapped to CLI argument styles.
 */
export type ParameterType = z.infer<typeof ParameterType>
export const ParameterType = z.enum([
  "string",
  "number",
  "boolean",
  "string[]",
  "number[]",
  "object",
])

/**
 * A function parameter mapped to a CLI argument.
 */
export type Parameter = z.infer<typeof Parameter>
export const Parameter: z.ZodType<{
  name: string
  type: ParameterType
  required: boolean
  default?: unknown
  description: string
  properties?: Parameter[]
}> = z.object({
  name: z.string(),
  type: ParameterType,
  required: z.boolean(),
  default: z.unknown().optional(),
  description: z.string(),
  properties: z.lazy(() => z.array(Parameter)).optional(),
})

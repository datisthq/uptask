import { z } from "zod"
import { Parameter } from "./parameter.ts"

/**
 * An exported function extracted from a source file.
 */
export type Function = z.infer<typeof Function>
export const Function = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.array(Parameter),
})

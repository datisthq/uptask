import { z } from "zod"
import { Module } from "./module.ts"

/**
 * A named subcommand that aggregates modules matching its pattern.
 */
export type Group = z.infer<typeof Group>
export const Group = z.object({
  name: z.string(),
  pattern: z.string(),
  modules: z.array(Module),
})

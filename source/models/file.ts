import { z } from "zod"

/**
 * A discovered TypeScript source module.
 */
export type Module = z.infer<typeof Module>
export const Module = z.object({
  path: z.string(),
})

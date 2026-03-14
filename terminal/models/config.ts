import { z } from "zod"

/**
 * A project configuration mapping file patterns to task modules.
 */
export type Config = z.infer<typeof Config>
export const Config = z.object({
  name: z.string(),
  description: z.string(),
  pattern: z.string(),
})

import { z } from "zod"

/**
 * A discovered TypeScript source file.
 */
export type File = z.infer<typeof File>
export const File = z.object({
  path: z.string(),
})

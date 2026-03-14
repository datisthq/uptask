import { z } from "zod"
import { Function } from "./function.ts"

/**
 * A discovered TypeScript source file with its exported functions.
 */
export type File = z.infer<typeof File>
export const File = z.object({
  path: z.string(),
  functions: z.array(Function),
})

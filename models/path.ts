import { z } from "zod"

/**
 * Absolute path to a discovered TypeScript source file.
 */
export type Path = z.infer<typeof Path>
export const Path = z.string()

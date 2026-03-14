import { z } from "zod"
import packageJson from "../package.json" with { type: "json" }

/**
 * A project configuration mapping file patterns to task modules.
 */
export type Config = z.infer<typeof Config>
export const Config = z.object({
  name: z.string().default(packageJson.name),
  version: z.string().default(packageJson.version),
  description: z.string().default(packageJson.description),
  pattern: z.string().default("@*.ts"),
})

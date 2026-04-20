import type { z } from "zod"
import { Config } from "../../models/config.ts"

/**
 * Validate and fill defaults for a partial config object.
 */
export function defineConfig(
  input: z.input<typeof Config>,
): z.output<typeof Config> {
  return Config.parse(input)
}

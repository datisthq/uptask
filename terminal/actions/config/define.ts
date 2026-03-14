import { Config } from "../../models/config.ts"

/**
 * Validate unknown input against the Config schema.
 */
export function defineConfig(input: unknown): Config {
  return Config.parse(input)
}

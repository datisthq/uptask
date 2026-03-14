import { resolve } from "node:path"
import { defineConfig } from "./define.ts"

/**
 * Load and validate a config file, defaulting to uptask.config.ts in cwd.
 */
export async function loadConfig(path?: string) {
  const resolved = resolve(path ?? "uptask.config.ts")
  try {
    const module: Record<string, unknown> = await import(resolved)
    return defineConfig(module.default)
  } catch (error) {
    if (!path && error instanceof Error && "code" in error && error.code === "ERR_MODULE_NOT_FOUND") {
      return defineConfig({})
    }
    throw error
  }
}

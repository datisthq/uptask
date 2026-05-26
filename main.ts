import { loadConfig } from "./actions/config/load.ts"
import { createProgram } from "./actions/program/create.ts"
import { ValidationError } from "./helpers/error.ts"

const configIndex = process.argv.findIndex(a => a === "-c" || a === "--config")
const configPath = configIndex !== -1 ? process.argv[configIndex + 1] : undefined
const config = await loadConfig(configPath)

const program = createProgram(config)
try {
  await program.parseAsync()
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`error: ${error.message}`)
    process.exit(1)
  }
  throw error
}

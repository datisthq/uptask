/**
 * Deploy to an environment
 * @param env The target environment
 * @param dryRun Run without making changes
 */
export async function deploy(env: string, dryRun = false) {
  return { env, dryRun }
}

/**
 * Build the project
 * @param watch Enable watch mode
 * @param concurrency Number of parallel builds
 */
export function build(watch: boolean, concurrency: number = 4) {
  return { watch, concurrency }
}

function _helperFunction() {
  return "not exported"
}

import pAll from "p-all"

/**
 * Executes an array of functions concurrently with optional concurrency limit.
 *
 * This utility allows running multiple async functions in parallel while
 * controlling the maximum number of concurrent executions.
 *
 * @param functions - Array of functions that return promises
 * @param config - Configuration options
 * @param config.concurrency - Maximum number of functions to execute simultaneously
 *                            (defaults to unlimited concurrency)
 * @returns A promise that resolves when all functions have completed
 * @throws If any of the functions throws an error
 */
export async function batchFunctions(
  functions: (() => PromiseLike<unknown>)[],
  config?: { concurrency?: number },
) {
  const concurrency = config?.concurrency ?? Number.POSITIVE_INFINITY
  await pAll(functions, { concurrency })
}

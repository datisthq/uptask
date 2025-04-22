import pAll from "p-all"

/**
 * Executes an array of functions concurrently with optional concurrency limit.
 */
export async function batchFunctions(
  functions: (() => PromiseLike<unknown>)[],
  config?: { concurrency?: number },
) {
  const concurrency = config?.concurrency ?? Number.POSITIVE_INFINITY
  await pAll(functions, { concurrency })
}

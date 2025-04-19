import pAll from "p-all"

export async function batchFunctions(
  functions: (() => PromiseLike<unknown>)[],
  config?: { concurrency?: number },
) {
  const concurrency = config?.concurrency ?? Number.POSITIVE_INFINITY
  await pAll(functions, { concurrency })
}

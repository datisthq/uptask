/**
 * Desctiption
 */
export function test1(
  target: string,
  amount: number = 3,
  dryRun: boolean = false,
) {
  console.log(target, amount, dryRun)
}

/**
 * Desctiption
 */
export function test2(target: string, options: { dryRun: boolean }) {
  console.log(target, options)
}

/**
 * Desctiption
 */
export function test3(paths: string[]) {
  console.log(paths)
}

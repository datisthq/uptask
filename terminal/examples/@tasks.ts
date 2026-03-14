/**
 * Description
 *
 * @param target Build target name
 * @param amount Number of iterations
 * @param dryRun Run without making changes
 */
export function test1(
  target: string,
  amount: number = 3,
  dryRun: boolean = false,
) {
  console.log(target, amount, dryRun)
}

/**
 * Description
 */
export function test2(target: string, options: { dryRun: boolean }) {
  console.log(target, options)
}

/**
 * Description
 */
export function test3(paths: string[], amount: number) {
  console.log(paths, amount)
}

/**
 * Description
 */
export function test4(target: string, amounts: number[]) {
  console.log(target, amounts)
}

/**
 * Description
 */
export function test5(target: string, options: { amounts: number[] }) {
  console.log(target, options)
}

/**
 * Description
 */
export function test6(options: { nested: { amounts: number[] } }) {
  console.log(options)
}

/**
 * Compile a target
 * @param target The build target
 * @param options.dryRun Run without making changes
 */
export function compile(target: string, options: { dryRun: boolean }) {
  return { target, options }
}

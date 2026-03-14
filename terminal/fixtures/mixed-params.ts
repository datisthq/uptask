/**
 * Process data with various param types
 * @param input Input file path
 * @param retries Number of retry attempts
 * @param verbose Enable verbose logging
 * @param config Configuration object
 */
export function process(
  input: string,
  retries: number = 3,
  verbose: boolean = false,
  config: { format: string },
) {
  return { input, retries, verbose, config }
}

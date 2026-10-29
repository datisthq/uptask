/**
 * Copy files between locations
 * @param source Source path
 * @param destination Destination path
 * @param count Number of copies
 */
export function copy(source: string, destination: string, count: number) {
  return { source, destination, count }
}

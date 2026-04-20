/**
 * Deploy with tags and environment
 * @param tags Deployment tags
 * @param env Target environment
 * @param labels Required labels
 */
export function deploy(tags: string[], env: string, labels: string[]) {
  return { tags, env, labels }
}

/**
 * Apply pending database migrations.
 *
 * @param target Migration target name
 * @param dryRun Show pending migrations without applying them
 */
export function migrate(target: string, dryRun: boolean = false) {
  console.log("migrate", target, dryRun)
}

/**
 * Seed the database with sample data.
 *
 * @param profile Seed profile to apply
 */
export function seed(profile: string = "default") {
  console.log("seed", profile)
}

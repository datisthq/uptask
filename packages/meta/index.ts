/**
 * Meta package that re-exports all functionality from @uptask/core, @uptask/cli, and @uptask/cron.
 *
 * This provides a convenient way to import all UpTask functionality from a single package.
 *
 * @module uptask
 */

// Re-export everything from the core package
export { Task } from "@uptask/core"
export type { ILogger } from "@uptask/core"
export { createTasks } from "@uptask/core"
export { findTask } from "@uptask/core"
export { batchFunctions } from "@uptask/core"

// Re-export everything from the CLI package
export { runTasksCli } from "@uptask/cli"

// Re-export everything from the cron package
export { scheduleTasks } from "@uptask/cron"

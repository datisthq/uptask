/**
 * Meta package that re-exports all functionality from @uptask/core, @uptask/cli, and @uptask/cron.
 *
 * This provides a convenient way to import all UpTask functionality from a single package.
 *
 * @module uptask
 */

// Re-export everything from the core package
export { Task } from "../core/models/task.ts"
export type { ILogger } from "../core/models/logger.ts"
export { createTasks } from "../core/actions/createTasks.ts"
export { findTask } from "../core/actions/findTask.ts"
export { batchFunctions } from "../core/actions/batchFunctions.ts"

// Re-export everything from the CLI package
export { runTaskInCli } from "../cli/actions/runTaskInCli.ts"

// Re-export everything from the cron package
export { scheduleTasks } from "../cron/actions/scheduleTasks.ts"

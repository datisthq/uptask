# UpTask

Primitives and helpers for running tasks in TypeScript with support for logging, retries, timeouts, CLI integration, and scheduling.

## Installation

> Replace `npm install` with `pnpm add` if you're using pnpm.

```bash
npm install uptask
# OR npm install @uptask/core @uptask/cli @uptask/cron
```

## Packages

| Package | Description | Changelog |
|---------|-------------|---------|
| [uptask](https://github.com/datisthq/uptask) | Meta-package that re-exports all functionality | [![npm version](https://img.shields.io/npm/v/uptask.svg?label=%20)](https://github.com/datisthq/uptask/tree/main/packages/meta/CHANGELOG.md) |
| [@uptask/core](https://github.com/datisthq/uptask/tree/main/packages/core) | Core task management functionality | [![npm version](https://img.shields.io/npm/v/@uptask/core.svg?label=%20)](https://github.com/datisthq/uptask/tree/main/packages/core/CHANGELOG.md) |
| [@uptask/cli](https://github.com/datisthq/uptask/tree/main/packages/cli) | Command line interface integration | [![npm version](https://img.shields.io/npm/v/@uptask/cli.svg?label=%20)](https://github.com/datisthq/uptask/tree/main/packages/cli/CHANGELOG.md) |
| [@uptask/cron](https://github.com/datisthq/uptask/tree/main/packages/cron) | Task scheduling with cron expressions | [![npm version](https://img.shields.io/npm/v/@uptask/cron.svg?label=%20)](https://github.com/datisthq/uptask/tree/main/packages/cron/CHANGELOG.md) |

## Meta

A meta package `uptask` re-exports all functionality from the implementation packages:

```typescript
import { Task, runTasksCli, scheduleTasks } from 'uptask' // and others functions
```

## Core

The core package provides the main `Task` abstract class and utilities for task management.

> **Note:** It is vital to use `as const` when defining task names to ensure type safety.

```typescript
import { Task, createTasks, findTask } from '@uptask/core'

// Create a custom task
class MyTask extends Task<{ input: string }> {
  name = "myTask" as const

  async makeComplete() {
    const { input } = this.config
    this.logger.info(`Processing: ${input}`)
    // Task implementation...
    return Promise.resolve()
  }
}

// Create a fully-typed task registry
const tasks = createTasks([MyTask])

// Configure and run a task (config is fully typed)
tasks.myTask.updateConfig({ input: "test-value" })
await tasks.myTask.run()

// Find a task by criteria
const specificTask = findTask(tasks, task => task.name.includes("my"))
if (specificTask) await specificTask.run({ retries: 3, timeout: 5000 })

// Type-safety
tasks.badTask
// TypeScript error: Property 'badTask' does not exist
```

## CLI

The CLI package provides command-line interface support for your tasks.

```typescript
import { createTasks, Task } from '@uptask/core'
import { runTasksCli } from '@uptask/cli'
import { MyTask, OtherTask } from './tasks.ts'

// Create the task registry
const tasks = createTasks([MyTask, OtherTask])

// Run the CLI
runTasksCli(tasks)
```

Then run your tasks from the command line:

```bash
node script.js --help
node script.js myTask --config '{"input":"value"}'
```

## Cron

The cron package provides scheduling capabilities for your tasks.

```typescript
import { createTasks } from 'uptask/core'
import { scheduleTasks } from 'uptask/cron'
import { DailyTask, HourlyTask } from './tasks.ts'

// Create the task registry
const tasks = createTasks([DailyTask, HourlyTask])

// Schedule tasks with cron expressions
scheduleTasks({
  "0 0 * * *": tasks.dailyTask,    // Run daily at midnight
  "0 * * * *": tasks.hourlyTask,   // Run every hour
}, {
  timeZone: "America/New_York",        // Optional configuration
  runOnInit: true,                     // Run immediately on startup
})
```

## Recipes

### Task with Retries and Timeout

```typescript
import { Task } from '@uptask/core'

class ApiTask extends Task {
  name = "apiRequest" as const

  async makeComplete() {
    // Implementation...
    return Promise.resolve()
  }
}

// Run with 3 retries and 10 second timeout
const task = new ApiTask()
await task.run({ retries: 3, timeout: 10000 })
```

### Batch Processing

```typescript
import { batchFunctions } from '@uptask/core'
import { createTasks, batchFunctions, Task } from '@uptask/core'
import { MyTask, OtherTask } from './tasks.ts'

class MyFlow extends Task {
  name = "myFlow" as const
  type = "flow"

  async makeComplete() {
    await batchFunctions([
      () => tasks.myTask.run({retries: 3, timeout: 10000}),
      tasks.otherTask.run,
    ], { concurrency: 5 })
  }
}
```

### Task and Flow Management

It is a common approach to group tasks into flows for better organization and management.

```typescript
import { createTasks, batchFunctions, Task } from '@uptask/core'
import { scheduleTasks } from '@uptask/cron'
import { MyTask, OtherTask } from './tasks.ts'

class MyFlow extends Task {
  name = "myFlow" as const
  type = "flow"

  async makeComplete() {
    await tasks.myTask.run()
    await tasks.otherTask.run()
  }
}

const flows = createTasks([MyFlow])

scheduleTasks({
  "0 0 * * *": flows.myFlow,    // Run daily at midnight
})
```

### Custom Logger

```typescript
import { Task } from '@uptask/core'
import { pino } from "pino"

class MyTask extends Task {
  name = "myTask" as const

  createLogger() {
    const logger = pino(...)
    return logger.child({ task: this.name })
  }
}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](LICENSE.md)

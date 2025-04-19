# UpTask

Primitives and helpers for running tasks in TypeScript with support for logging, retries, timeouts, CLI integration, and scheduling.

## Prerequisites

- **Node.js**: v24+ or Deno/Bun (not tested)

> **Note:** UpTask is shipped as a pure TypeScript library without a build artifacts. You can import the code into your project build workflow or run it with Node v24+ that support direct TypeScript execution.

## Installation

### All-in-one package

```bash
# Install everything in one package
npm install uptask
```

### Individual packages

```bash
# Install core package only
npm install @uptask/core

# Optional CLI support
npm install @uptask/cli

# Optional scheduling support
npm install @uptask/cron
```

With pnpm:

```bash
# All-in-one
pnpm add uptask

# Or individual packages
pnpm add @uptask/core @uptask/cli @uptask/cron
```

## Meta

> **TODO:** `@uptask/meta` is going to be renamed to `uptask`

The meta package `@uptask/meta` re-exports all functionality from following packages:

- `@uptask/core`
- `@uptask/cli`
- `@uptask/cron`

```typescript
import { Task, runTaskInCli, scheduleTasks } from '@uptask/meta' // and others
```

## Core

The core package provides the main `Task` abstract class and utilities for task management.

```typescript
import { Task, createTasks, findTask } from '@uptask/core'

// Create a custom task
class MyTask extends Task<{ input: string }> {
  name = "myTask"

  createLogger() {
    return console
  }

  async makeComplete() {
    const { input } = this.config
    this.logger.info(`Processing: ${input}`)
    // Task implementation...
    return Promise.resolve()
  }
}

// Create a fully-typed task registry
const tasks = createTasks([MyTask])

// Configure and run a task
tasks.myTask.updateConfig({ input: "test-value" })
await tasks.myTask.run()

// Find a task by criteria
const specificTask = findTask(tasks, task => task.name.includes("my"))
await specificTask.run({ retries: 3, timeout: 5000 })
```

## CLI

The CLI package provides command-line interface support for your tasks.

```typescript
import { createTasks, Task } from '@uptask/core'
import { runTaskInCli } from '@uptask/cli'
import { MyTask, OtherTask } from './tasks.ts'

// Create the task registry
const tasks = createTasks([MyTask, OtherTask])

// Run the CLI
runTaskInCli(tasks)
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
  name = "apiRequest"

  createLogger() {
    return console
  }

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

// Process items in batches with limited concurrency
async function processItems(items) {
  const functions = items.map(item => () => processItem(item))
  await batchFunctions(functions, { concurrency: 5 })
}
```

### Task and Flow Management

It is a common approach to group tasks into flows for better organization and management.

```typescript
import { createTasks, batchFunctions, Task } from '@uptask/core'
import { scheduleTasks } from '@uptask/cron'
import { MyTask, OtherTask } from './tasks.ts'

class MyFlow extends Task {
  type = "flow"
  name = "myFlow"

  createLogger() {
    return console
  }

  async makeComplete() {
    await batchFunctions([
      () => tasks.myTask.run({retries: 3, timeout: 10000}),
      tasks.otherTask.run,
    ], { concurrency: 5 })
  }
}

const flows = createTasks([MyFlow])

scheduleTasks({
  "0 0 * * *": flows.myFlow,    // Run daily at midnight
})
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

[MIT](LICENSE.md)

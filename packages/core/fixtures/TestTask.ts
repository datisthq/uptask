import { vi } from "vitest"
import type { ILogger } from "../models/logger.ts"
import { Task } from "../models/task.ts"

/**
 * Base test task class that provides a standard mock logger implementation
 * for use in tests.
 */
export class TestTask<T = Record<string, any>> extends Task<T> {
  name = "test-task"

  constructor(name?: string) {
    super()
    if (name) {
      this.name = name
    }
  }

  createLogger(): ILogger {
    return {
      trace: vi.fn(),
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      child: vi.fn(),
    }
  }

  async makeComplete(): Promise<void> {
    return Promise.resolve()
  }
}

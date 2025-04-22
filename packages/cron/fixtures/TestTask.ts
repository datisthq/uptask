import type { ILogger } from "@uptask/core"
import { Task } from "@uptask/core"
import { vi } from "vitest"

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

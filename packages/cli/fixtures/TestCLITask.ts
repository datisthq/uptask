import type { ILogger } from "@uptask/core"
import { Task } from "@uptask/core"
import { vi } from "vitest"

/**
 * Test task implementation for CLI testing
 */
export class TestCLITask<T = Record<string, any>> extends Task<T> {
  name = "test-cli-task"
  runMock = vi.fn().mockResolvedValue(undefined)

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
      fatal: vi.fn(),
      child: vi.fn(),
    }
  }

  async makeComplete(): Promise<void> {
    return this.runMock()
  }
}

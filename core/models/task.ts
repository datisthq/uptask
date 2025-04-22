import pRetry from "p-retry"
import pTimeout from "p-timeout"
import type { ILogger } from "./logger.js"

/**
 * Abstract base class for creating tasks.
 */
export abstract class Task<IConfig = Record<string, any>> {
  /**
   * The unique name of the task.
   * This should be overridden by implementing classes.
   */
  abstract name: string

  /**
   * The type of the task, defaults to "task".
   * Can be overridden by subclasses to indicate different task types.
   */
  type = "task"

  /**
   * The task configuration.
   * Private field storing configuration parameters.
   */
  #config: Partial<IConfig> = {}

  /**
   * Cached logger instance.
   */
  #logger?: ILogger

  /**
   * Gets the logger for this task, creating it if necessary.
   */
  get logger() {
    this.#logger = this.#logger || this.createLogger()
    return this.#logger
  }

  /**
   * Create a logger for this task.
   */
  createLogger(): ILogger {
    return { ...console, child: () => this.logger }
  }

  /**
   * Gets the current configuration of the task.
   */
  get config() {
    return this.#config
  }

  /**
   * Updates the task configuration by merging the provided config
   * with the existing config.
   */
  updateConfig(config: Partial<IConfig>) {
    this.#config = { ...this.#config, ...config }
  }

  /**
   * The main implementation of the task.
   * This must be implemented by derived classes.
   */
  abstract makeComplete(): Promise<void>

  /**
   * Runs the task with optional retry and timeout configuration.
   * Handles logging of start, completion, and errors.
   */
  async run(config?: { retries?: number; timeout?: number }) {
    const retries = config?.retries ?? 0
    const timeout = config?.timeout ?? Number.POSITIVE_INFINITY

    this.logger.info(`Started ${this.type}: ${this.name}`)
    try {
      await pTimeout(pRetry(this.makeComplete.bind(this), { retries }), {
        milliseconds: timeout,
      })
      this.logger.info(`Finised ${this.type}: ${this.name}`)
    } catch (error) {
      this.logger.error(`Errored ${this.type}: ${this.name}`, { error })
      throw error
    }
  }
}

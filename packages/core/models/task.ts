import pRetry from "p-retry"
import pTimeout from "p-timeout"
import type { ILogger } from "./logger.ts"

// TODO: implement retries/timeout/fail-silent/etc
export abstract class Task<IConfig = Record<string, any>> {
  abstract name: string
  type = "task"
  #config: Partial<IConfig> = {}
  #logger?: ILogger

  get logger() {
    this.#logger = this.#logger || this.createLogger()
    return this.#logger
  }

  abstract createLogger(): ILogger

  get config() {
    return this.#config
  }

  updateConfig(config: Partial<IConfig>) {
    this.#config = { ...this.#config, ...config }
  }

  abstract makeComplete(): Promise<void>

  // TODO: implement retries logging
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

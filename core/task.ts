import type { ILogger } from "./logger.ts"

// TODO: implement retries/timeout/fail-silent/etc
export abstract class Task<IConfig = Record<string, any>> {
  abstract name: string
  abstract type: "task" | "flow"
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

  async run() {
    this.logger.info(`Started ${this.type}: ${this.name}`)
    try {
      await this.makeComplete()
      this.logger.info(`Finised ${this.type}: ${this.name}`)
    } catch (error) {
      this.logger.error(`Errored ${this.type}: ${this.name}`, { error })
      throw error
    }
  }

  abstract makeComplete(): Promise<void>
}

import fs from "node:fs"
import { join } from "node:path"
import { temporaryDirectoryTask } from "tempy"
import { describe, expect, it } from "vite-plus/test"
import { loadConfig } from "./load.ts"

describe("loadConfig", () => {
  it("should return defaults when no config file exists", () =>
    temporaryDirectoryTask(async tmpDir => {
      const original = process.cwd()
      process.chdir(tmpDir)
      try {
        const config = await loadConfig()
        expect(config.name).toBe("uptask")
        expect(config.pattern).toBe("@*.ts")
      } finally {
        process.chdir(original)
      }
    }))

  it("should throw when explicit path does not exist", async () => {
    await expect(loadConfig("/nonexistent/config.ts")).rejects.toThrow()
  })

  it("should load config from explicit path", () =>
    temporaryDirectoryTask(async tmpDir => {
      const configPath = join(tmpDir, "uptask.config.ts")
      fs.writeFileSync(configPath, 'export default { name: "my-app" }\n')
      const config = await loadConfig(configPath)
      expect(config.name).toBe("my-app")
    }))

  it("should merge loaded config with defaults", () =>
    temporaryDirectoryTask(async tmpDir => {
      const configPath = join(tmpDir, "uptask.config.ts")
      fs.writeFileSync(
        configPath,
        'export default { pattern: "tasks/**/*.ts" }\n',
      )
      const config = await loadConfig(configPath)
      expect(config.pattern).toBe("tasks/**/*.ts")
      expect(config.name).toBe("uptask")
    }))
})

import fs from "node:fs"
import os from "node:os"
import { join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { loadConfig } from "./load.ts"

describe("loadConfig", () => {
  let tmpDir: string
  const originalCwd = process.cwd()

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(join(os.tmpdir(), "loadconfig-"))
  })

  afterEach(() => {
    process.chdir(originalCwd)
    fs.rmSync(tmpDir, { recursive: true })
  })

  it("should return defaults when no config file exists", async () => {
    process.chdir(tmpDir)
    const config = await loadConfig()
    expect(config.name).toBe("uptask")
    expect(config.pattern).toBe("@*.ts")
  })

  it("should throw when explicit path does not exist", async () => {
    await expect(loadConfig("/nonexistent/config.ts")).rejects.toThrow()
  })

  it("should load config from explicit path", async () => {
    const configPath = join(tmpDir, "uptask.config.ts")
    fs.writeFileSync(configPath, 'export default { name: "my-app" }\n')
    const config = await loadConfig(configPath)
    expect(config.name).toBe("my-app")
  })

  it("should merge loaded config with defaults", async () => {
    const configPath = join(tmpDir, "uptask.config.ts")
    fs.writeFileSync(
      configPath,
      'export default { pattern: "tasks/**/*.ts" }\n',
    )
    const config = await loadConfig(configPath)
    expect(config.pattern).toBe("tasks/**/*.ts")
    expect(config.name).toBe("uptask")
  })
})

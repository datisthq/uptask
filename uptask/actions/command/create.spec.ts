import path from "node:path"
import { describe, expect, it } from "vitest"
import { parseFile } from "../file/parse.ts"
import { createCommand } from "./create.ts"

const fixturesDir = path.resolve(import.meta.dirname, "../file/fixtures")

function findByName<T extends { name: string }>(items: T[], name: string): T {
  const item = items.find(i => i.name === name)
  if (!item) throw new Error(`Not found: ${name}`)
  return item
}

describe("createCommand", () => {
  it("should create a Commander command with correct name", () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    const func = findByName(file.functions, "deploy")
    const cmd = createCommand(file, func)
    expect(cmd.name()).toBe("deploy")
  })

  it("should set description", () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    const func = findByName(file.functions, "deploy")
    const cmd = createCommand(file, func)
    expect(cmd.description()).toBe("Deploy to an environment")
  })

  it("should register options for parameters", () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    const func = findByName(file.functions, "deploy")
    const cmd = createCommand(file, func)
    const options = cmd.options.map(o => o.long)
    expect(options).toContain("--env")
    expect(options).toContain("--dry-run")
  })

  it("should execute function via action", async () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    const func = findByName(file.functions, "deploy")
    const cmd = createCommand(file, func)
    cmd.exitOverride()

    await cmd.parseAsync(["--env", "staging"], { from: "user" })
  })
})

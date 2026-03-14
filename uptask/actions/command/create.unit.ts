import path from "node:path"
import { describe, expect, it } from "vitest"
import { parseFunctions } from "../function/parse.ts"
import { createCommand } from "./create.ts"

const fixturesDir = path.resolve(import.meta.dirname, "../function/fixtures")

function findByName<T extends { name: string }>(items: T[], name: string): T {
  const item = items.find(i => i.name === name)
  if (!item) throw new Error(`Not found: ${name}`)
  return item
}

describe("createCommand", () => {
  it("should create a Commander command with correct name", () => {
    const funcs = parseFunctions({ path: path.join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    expect(cmd.name()).toBe("deploy")
  })

  it("should set description", () => {
    const funcs = parseFunctions({ path: path.join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    expect(cmd.description()).toBe("Deploy to an environment")
  })

  it("should register options for parameters", () => {
    const funcs = parseFunctions({ path: path.join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    const options = cmd.options.map(o => o.long)
    expect(options).toContain("--env")
    expect(options).toContain("--dry-run")
  })

  it("should execute function via action", async () => {
    const funcs = parseFunctions({ path: path.join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    cmd.exitOverride()

    await cmd.parseAsync(["--env", "staging"], { from: "user" })
  })
})

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

  it("should register string params as arguments", () => {
    const funcs = parseFunctions({ path: path.join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    const argNames = cmd.registeredArguments.map(a => a.name())
    expect(argNames).toContain("env")
  })

  it("should register boolean params as options", () => {
    const funcs = parseFunctions({ path: path.join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--dry-run")
    expect(optionFlags).not.toContain("--env")
  })

  it("should register optional number params as options", () => {
    const funcs = parseFunctions({ path: path.join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "build")
    const cmd = createCommand(func)
    const argNames = cmd.registeredArguments.map(a => a.name())
    expect(argNames).not.toContain("concurrency")
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--concurrency")
    expect(optionFlags).toContain("--watch")
  })

  it("should execute function via action", async () => {
    const funcs = parseFunctions({ path: path.join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    cmd.exitOverride()

    await cmd.parseAsync(["staging"], { from: "user" })
  })

  it("should pass arguments and options to function in correct order", async () => {
    const funcs = parseFunctions({ path: path.join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    cmd.exitOverride()

    await cmd.parseAsync(["production", "--dry-run"], { from: "user" })
  })

  it("should decompose inline object params into individual options", () => {
    const funcs = parseFunctions({
      path: path.join(fixturesDir, "inline-object.ts"),
    })
    const func = findByName(funcs, "compile")
    const cmd = createCommand(func)
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--dry-run")
    expect(optionFlags).not.toContain("--options")
  })

  it("should default boolean in decomposed object to false", () => {
    const funcs = parseFunctions({
      path: path.join(fixturesDir, "inline-object.ts"),
    })
    const func = findByName(funcs, "compile")
    const cmd = createCommand(func)
    const dryRunOption = cmd.options.find(o => o.long === "--dry-run")
    expect(dryRunOption?.defaultValue).toBe(false)
  })

  it("should register first array param as variadic argument", () => {
    const funcs = parseFunctions({
      path: path.join(fixturesDir, "arrays.ts"),
    })
    const func = findByName(funcs, "run")
    const cmd = createCommand(func)
    const argNames = cmd.registeredArguments.map(a => a.name())
    expect(argNames).toContain("tags")
    expect(cmd.registeredArguments[0]?.variadic).toBe(true)
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--ports")
    expect(optionFlags).not.toContain("--tags")
  })

  it("should register second array param as repeatable option", async () => {
    const funcs = parseFunctions({
      path: path.join(fixturesDir, "arrays.ts"),
    })
    const func = findByName(funcs, "run")
    const cmd = createCommand(func)
    cmd.exitOverride()

    await cmd.parseAsync(["a", "b", "--ports", "80", "--ports", "443"], {
      from: "user",
    })
  })

  it("should execute with decomposed object params", async () => {
    const funcs = parseFunctions({
      path: path.join(fixturesDir, "inline-object.ts"),
    })
    const func = findByName(funcs, "compile")
    const cmd = createCommand(func)
    cmd.exitOverride()

    await cmd.parseAsync(["myTarget", "--dry-run"], { from: "user" })
  })
})

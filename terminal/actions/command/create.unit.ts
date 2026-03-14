import { join } from "node:path"
import { describe, expect, it } from "vitest"
import type { Function } from "../../models/function.ts"
import { parseFunctions } from "../function/parse.ts"
import { createCommand } from "./create.ts"

const fixturesDir = join(import.meta.dirname, "../../fixtures")

function findByName<T extends { name: string }>(items: T[], name: string): T {
  const item = items.find(i => i.name === name)
  if (!item) throw new Error(`Not found: ${name}`)
  return item
}

describe("createCommand", () => {
  it("should create a Commander command with correct name", () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    expect(cmd.name()).toBe("deploy")
  })

  it("should set description", () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    expect(cmd.description()).toBe("Deploy to an environment")
  })

  it("should register string params as arguments", () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    const argNames = cmd.registeredArguments.map(a => a.name())
    expect(argNames).toContain("env")
  })

  it("should register boolean params as options", () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--dry-run")
    expect(optionFlags).not.toContain("--env")
  })

  it("should register optional number params as options", () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "build")
    const cmd = createCommand(func)
    const argNames = cmd.registeredArguments.map(a => a.name())
    expect(argNames).not.toContain("concurrency")
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--concurrency")
    expect(optionFlags).toContain("--watch")
  })

  it("should execute function via action", async () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    cmd.exitOverride()

    await cmd.parseAsync(["staging"], { from: "user" })
  })

  it("should pass arguments and options to function in correct order", async () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    cmd.exitOverride()

    await cmd.parseAsync(["production", "--dry-run"], { from: "user" })
  })

  it("should decompose inline object params into individual options", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "inline-object.ts"),
    })
    const func = findByName(funcs, "compile")
    const cmd = createCommand(func)
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--dry-run")
    expect(optionFlags).not.toContain("--options")
  })

  it("should default boolean in decomposed object to false", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "inline-object.ts"),
    })
    const func = findByName(funcs, "compile")
    const cmd = createCommand(func)
    const dryRunOption = cmd.options.find(o => o.long === "--dry-run")
    expect(dryRunOption?.defaultValue).toBe(false)
  })

  it("should register first array param as variadic argument", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "arrays.ts"),
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
      path: join(fixturesDir, "arrays.ts"),
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
      path: join(fixturesDir, "inline-object.ts"),
    })
    const func = findByName(funcs, "compile")
    const cmd = createCommand(func)
    cmd.exitOverride()

    await cmd.parseAsync(["myTarget", "--dry-run"], { from: "user" })
  })

  it("should handle command with no parameters", () => {
    const func: Function = {
      path: join(fixturesDir, "no-jsdoc.ts"),
      name: "zeroArgs",
      description: "",
      parameters: [],
    }
    const cmd = createCommand(func)
    expect(cmd.registeredArguments).toHaveLength(0)
    expect(cmd.options).toHaveLength(0)
  })

  it("should handle command with no description", () => {
    const func: Function = {
      path: join(fixturesDir, "no-jsdoc.ts"),
      name: "noDescription",
      description: "",
      parameters: [
        { name: "name", type: "string", required: true, description: "" },
      ],
    }
    const cmd = createCommand(func)
    expect(cmd.description()).toBe("")
  })

  it("should register required string option after variadic", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "required-string-option.ts"),
    })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--env")
  })

  it("should coerce number arguments to Number", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "multiple-args.ts"),
    })
    const func = findByName(funcs, "copy")
    const cmd = createCommand(func)
    const argNames = cmd.registeredArguments.map(a => a.name())
    expect(argNames).toContain("source")
    expect(argNames).toContain("destination")
    expect(argNames).toContain("count")
  })

  it("should convert camelCase param names to kebab-case flags", () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--dry-run")
  })

  it("should register required number as option", () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "build")
    const cmd = createCommand(func)
    const watchOption = cmd.options.find(o => o.long === "--watch")
    expect(watchOption).toBeDefined()
  })

  it("should handle optional string option with default", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "string-defaults.ts"),
    })
    const func = findByName(funcs, "format")
    const cmd = createCommand(func)
    const styleOption = cmd.options.find(o => o.long === "--style")
    expect(styleOption).toBeDefined()
    expect(styleOption?.defaultValue).toBe("pretty")
  })

  it("should register object param as JSON option", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "object-param.ts"),
    })
    const func = findByName(funcs, "configure")
    const cmd = createCommand(func)
    const configOption = cmd.options.find(o => o.long === "--config")
    expect(configOption).toBeDefined()
  })

  it("should handle nested object decomposition in options", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "nested-object.ts"),
    })
    const func = findByName(funcs, "setup")
    const cmd = createCommand(func)
    const optionFlags = cmd.options.map(o => o.long)
    expect(optionFlags).toContain("--inner")
    expect(optionFlags).toContain("--label")
  })

  it("should register optional array with default empty array", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "optional-array.ts"),
    })
    const func = findByName(funcs, "filter")
    const cmd = createCommand(func)
    const itemsOption = cmd.options.find(o => o.long === "--items")
    expect(itemsOption).toBeDefined()
    expect(itemsOption?.defaultValue).toEqual([])
  })

  it("should throw when function not found in module", async () => {
    const func: Function = {
      path: join(fixturesDir, "sample.ts"),
      name: "nonExistent",
      description: "",
      parameters: [],
    }
    const cmd = createCommand(func)
    cmd.exitOverride()
    await expect(cmd.parseAsync([], { from: "user" })).rejects.toThrow(
      "Function nonExistent not found",
    )
  })

  it("should handle required string array option", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "required-string-option.ts"),
    })
    const func = findByName(funcs, "deploy")
    const cmd = createCommand(func)
    const labelsOption = cmd.options.find(o => o.long === "--labels")
    expect(labelsOption).toBeDefined()
    expect(labelsOption?.required).toBe(true)
  })

  it("should pass default values for unspecified options", () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "build")
    const cmd = createCommand(func)
    const concurrencyOption = cmd.options.find(o => o.long === "--concurrency")
    expect(concurrencyOption?.defaultValue).toBe(4)
  })

  it("should build nested object from flat options", async () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "nested-object.ts"),
    })
    const func = findByName(funcs, "setup")
    const cmd = createCommand(func)
    cmd.exitOverride()
    await cmd.parseAsync(["--inner", "--label", "test"], { from: "user" })
  })

  it("should handle optional number option with default", () => {
    const funcs = parseFunctions({ path: join(fixturesDir, "sample.ts") })
    const func = findByName(funcs, "build")
    const cmd = createCommand(func)
    const concurrencyOption = cmd.options.find(o => o.long === "--concurrency")
    expect(concurrencyOption?.defaultValue).toBe(4)
  })

  it("should register required number[] option", () => {
    const func: Function = {
      path: join(fixturesDir, "sample.ts"),
      name: "test",
      description: "",
      parameters: [
        { name: "tags", type: "string[]", required: true, description: "" },
        { name: "counts", type: "number[]", required: true, description: "" },
      ],
    }
    const cmd = createCommand(func)
    const countsOption = cmd.options.find(o => o.long === "--counts")
    expect(countsOption).toBeDefined()
    expect(countsOption?.required).toBe(true)
  })
})

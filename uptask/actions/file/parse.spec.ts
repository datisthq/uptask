import path from "node:path"
import { describe, expect, it } from "vitest"
import { parseFile } from "./parse.ts"

const fixturesDir = path.resolve(import.meta.dirname, "fixtures")

function findByName<T extends { name: string }>(items: T[], name: string): T {
  const item = items.find(i => i.name === name)
  if (!item) throw new Error(`Not found: ${name}`)
  return item
}

describe("parseFile", () => {
  it("should extract exported functions from a file", () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    expect(file.path).toContain("sample.ts")
    expect(file.functions).toHaveLength(2)
  })

  it("should extract function names", () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    const names = file.functions.map(f => f.name)
    expect(names).toEqual(["deploy", "build"])
  })

  it("should not include non-exported functions", () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    const names = file.functions.map(f => f.name)
    expect(names).not.toContain("_helperFunction")
  })

  it("should extract JSDoc descriptions", () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    const deploy = findByName(file.functions, "deploy")
    expect(deploy.description).toBe("Deploy to an environment")
  })

  it("should extract parameter metadata", () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    const deploy = findByName(file.functions, "deploy")

    expect(deploy.parameters).toHaveLength(2)
    expect(deploy.parameters[0]).toMatchObject({
      name: "env",
      type: "string",
      required: true,
      description: "The target environment",
    })
    expect(deploy.parameters[1]).toMatchObject({
      name: "dryRun",
      type: "boolean",
      required: false,
      default: false,
      description: "Run without making changes",
    })
  })

  it("should extract number defaults", () => {
    const file = parseFile(path.join(fixturesDir, "sample.ts"))
    const build = findByName(file.functions, "build")
    const concurrency = findByName(build.parameters, "concurrency")
    expect(concurrency.type).toBe("number")
    expect(concurrency.default).toBe(4)
    expect(concurrency.required).toBe(false)
  })

  it("should extract array parameter types", () => {
    const file = parseFile(path.join(fixturesDir, "arrays.ts"))
    const run = findByName(file.functions, "run")

    expect(run.parameters[0]).toMatchObject({
      name: "tags",
      type: "string[]",
      required: true,
    })
    expect(run.parameters[1]).toMatchObject({
      name: "ports",
      type: "number[]",
      required: true,
    })
  })

  it("should extract object parameter types", () => {
    const file = parseFile(path.join(fixturesDir, "object-param.ts"))
    const configure = findByName(file.functions, "configure")
    expect(configure.parameters[0]).toMatchObject({
      name: "config",
      type: "object",
      required: true,
    })
  })
})

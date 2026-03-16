import { join } from "node:path"
import { describe, expect, it } from "vite-plus/test"
import { parseFunctions } from "./parse.ts"

const fixturesDir = join(import.meta.dirname, "../../fixtures")

function findByName<T extends { name: string }>(items: T[], name: string): T {
  const item = items.find(i => i.name === name)
  if (!item) throw new Error(`Not found: ${name}`)
  return item
}

describe("parseFunctions", () => {
  it("should extract exported functions from a module", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "sample.ts"),
    })
    expect(funcs[0]?.path).toContain("sample.ts")
    expect(funcs).toHaveLength(2)
  })

  it("should extract function names", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "sample.ts"),
    })
    const names = funcs.map(f => f.name)
    expect(names).toEqual(["deploy", "build"])
  })

  it("should not include non-exported functions", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "sample.ts"),
    })
    const names = funcs.map(f => f.name)
    expect(names).not.toContain("_helperFunction")
  })

  it("should extract JSDoc descriptions", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "sample.ts"),
    })
    const deploy = findByName(funcs, "deploy")
    expect(deploy.description).toBe("Deploy to an environment")
  })

  it("should extract parameter metadata", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "sample.ts"),
    })
    const deploy = findByName(funcs, "deploy")

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
    const funcs = parseFunctions({
      path: join(fixturesDir, "sample.ts"),
    })
    const build = findByName(funcs, "build")
    const concurrency = findByName(build.parameters, "concurrency")
    expect(concurrency.type).toBe("number")
    expect(concurrency.default).toBe(4)
    expect(concurrency.required).toBe(false)
  })

  it("should extract array parameter types", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "arrays.ts"),
    })
    const run = findByName(funcs, "run")

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
    const funcs = parseFunctions({
      path: join(fixturesDir, "object-param.ts"),
    })
    const configure = findByName(funcs, "configure")
    expect(configure.parameters[0]).toMatchObject({
      name: "config",
      type: "object",
      required: true,
    })
    expect(configure.parameters[0]).not.toHaveProperty("properties")
  })

  it("should extract inline object properties", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "inline-object.ts"),
    })
    const compile = findByName(funcs, "compile")
    expect(compile.parameters[1]).toMatchObject({
      name: "options",
      type: "object",
      required: true,
      properties: [
        {
          name: "dryRun",
          type: "boolean",
          required: true,
          default: false,
          description: "Run without making changes",
        },
      ],
    })
  })

  it("should return empty array for module with no exports", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "no-exports.ts"),
    })
    expect(funcs).toEqual([])
  })

  it("should return empty description when no JSDoc present", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "no-jsdoc.ts"),
    })
    const noDesc = findByName(funcs, "noDescription")
    expect(noDesc.description).toBe("")
  })

  it("should mark optional params as not required", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "optional-params.ts"),
    })
    const greet = findByName(funcs, "greet")
    const name = findByName(greet.parameters, "name")
    expect(name.required).toBe(false)
  })

  it("should extract string default values (double-quoted)", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "string-defaults.ts"),
    })
    const format = findByName(funcs, "format")
    const style = findByName(format.parameters, "style")
    expect(style.default).toBe("pretty")
  })

  it("should extract string default values (single-quoted)", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "string-defaults.ts"),
    })
    const format = findByName(funcs, "format")
    const quote = findByName(format.parameters, "quote")
    expect(quote.default).toBe("single")
  })

  it("should handle undefined default value", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "optional-params.ts"),
    })
    const greet = findByName(funcs, "greet")
    const fallback = findByName(greet.parameters, "fallback")
    expect(fallback.required).toBe(false)
    expect(fallback).not.toHaveProperty("default")
  })

  it("should extract nested inline object properties", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "nested-object.ts"),
    })
    const setup = findByName(funcs, "setup")
    const opts = findByName(setup.parameters, "opts")
    expect(opts.type).toBe("object")
    const outer = findByName(opts.properties ?? [], "outer")
    expect(outer.type).toBe("object")
    expect(outer.properties).toEqual([
      {
        name: "inner",
        type: "boolean",
        required: true,
        default: false,
        description: "Enable inner feature",
      },
    ])
  })

  it("should resolve unknown types as object", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "optional-params.ts"),
    })
    const withAlias = findByName(funcs, "withAlias")
    expect(withAlias.parameters[0]?.type).toBe("object")
  })

  it("should handle function with no parameters", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "no-jsdoc.ts"),
    })
    const zeroArgs = findByName(funcs, "zeroArgs")
    expect(zeroArgs.parameters).toEqual([])
  })

  it("should handle async functions", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "async-func.ts"),
    })
    const fetchData = findByName(funcs, "fetchData")
    expect(fetchData.name).toBe("fetchData")
    expect(fetchData.parameters[0]).toMatchObject({
      name: "url",
      type: "string",
      required: true,
    })
  })

  it("should default boolean properties in nested objects to false", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "nested-object.ts"),
    })
    const setup = findByName(funcs, "setup")
    const opts = findByName(setup.parameters, "opts")
    const outer = findByName(opts.properties ?? [], "outer")
    const inner = findByName(outer.properties ?? [], "inner")
    expect(inner.default).toBe(false)
  })

  it("should handle multiple required params", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "multiple-args.ts"),
    })
    const copy = findByName(funcs, "copy")
    expect(copy.parameters).toHaveLength(3)
    expect(copy.parameters[0]).toMatchObject({ name: "source", required: true })
    expect(copy.parameters[1]).toMatchObject({
      name: "destination",
      required: true,
    })
    expect(copy.parameters[2]).toMatchObject({ name: "count", required: true })
  })

  it("should set required=false for params with defaults", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "string-defaults.ts"),
    })
    const format = findByName(funcs, "format")
    expect(format.parameters[0]?.required).toBe(false)
    expect(format.parameters[1]?.required).toBe(false)
  })

  it("should use first JSDoc block for description", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "sample.ts"),
    })
    const deploy = findByName(funcs, "deploy")
    expect(deploy.description).toBe("Deploy to an environment")
  })

  it("should extract param descriptions from JSDoc tags", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "inline-object.ts"),
    })
    const compile = findByName(funcs, "compile")
    expect(compile.parameters[0]?.description).toBe("The build target")
  })

  it("should handle nested @param doc syntax", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "nested-object.ts"),
    })
    const setup = findByName(funcs, "setup")
    const opts = findByName(setup.parameters, "opts")
    const outer = findByName(opts.properties ?? [], "outer")
    const inner = findByName(outer.properties ?? [], "inner")
    expect(inner.description).toBe("Enable inner feature")
  })

  it("should not extract properties from index-signature objects", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "object-param.ts"),
    })
    const configure = findByName(funcs, "configure")
    expect(configure.parameters[0]?.properties).toBeUndefined()
  })

  it("should handle optional inline object properties", () => {
    const funcs = parseFunctions({
      path: join(fixturesDir, "nested-object.ts"),
    })
    const setup = findByName(funcs, "setup")
    const opts = findByName(setup.parameters, "opts")
    const label = findByName(opts.properties ?? [], "label")
    expect(label.required).toBe(false)
    expect(label.type).toBe("string")
  })
})

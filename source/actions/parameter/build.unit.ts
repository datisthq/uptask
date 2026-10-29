import { describe, expect, it } from "vite-plus/test"
import type { Parameter } from "../../models/parameter.ts"
import { buildSchema } from "./build.ts"

function param(partial: Partial<Parameter>): Parameter {
  return {
    name: "x",
    type: "string",
    required: true,
    description: "",
    ...partial,
  }
}

describe("buildSchema", () => {
  it("should validate a string value", () => {
    const schema = buildSchema(param({ type: "string" }))
    expect(schema.parse("ok")).toBe("ok")
    expect(() => schema.parse(1)).toThrow()
  })

  it("should validate a number value", () => {
    const schema = buildSchema(param({ type: "number" }))
    expect(schema.parse(42)).toBe(42)
    expect(() => schema.parse("42")).toThrow()
  })

  it("should validate a boolean value", () => {
    const schema = buildSchema(param({ type: "boolean" }))
    expect(schema.parse(true)).toBe(true)
    expect(() => schema.parse("true")).toThrow()
  })

  it("should validate a string[] value", () => {
    const schema = buildSchema(param({ type: "string[]" }))
    expect(schema.parse(["a", "b"])).toEqual(["a", "b"])
    expect(() => schema.parse([1])).toThrow()
  })

  it("should validate a number[] value", () => {
    const schema = buildSchema(param({ type: "number[]" }))
    expect(schema.parse([1, 2])).toEqual([1, 2])
    expect(() => schema.parse(["1"])).toThrow()
  })

  it("should validate an inline object with properties", () => {
    const schema = buildSchema(
      param({
        type: "object",
        properties: [
          { name: "port", type: "number", required: true, description: "" },
          { name: "host", type: "string", required: false, description: "" },
        ],
      }),
    )
    expect(schema.parse({ port: 80 })).toEqual({ port: 80 })
    expect(() => schema.parse({ port: "80" })).toThrow()
  })

  it("should validate a bag-object with no declared properties", () => {
    const schema = buildSchema(param({ type: "object" }))
    expect(schema.parse({ anything: 1 })).toEqual({ anything: 1 })
    expect(() => schema.parse(42)).toThrow()
  })

  it("should accept undefined for non-required parameters", () => {
    const schema = buildSchema(param({ type: "number", required: false }))
    expect(schema.parse(undefined)).toBeUndefined()
    expect(schema.parse(7)).toBe(7)
  })

  it("should recurse into nested object properties", () => {
    const schema = buildSchema(
      param({
        type: "object",
        properties: [
          {
            name: "db",
            type: "object",
            required: true,
            description: "",
            properties: [
              {
                name: "port",
                type: "number",
                required: true,
                description: "",
              },
            ],
          },
        ],
      }),
    )
    expect(schema.parse({ db: { port: 5432 } })).toEqual({
      db: { port: 5432 },
    })
    expect(() => schema.parse({ db: { port: "5432" } })).toThrow()
  })
})

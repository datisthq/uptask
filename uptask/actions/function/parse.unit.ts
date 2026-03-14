import { describe, expect, it } from "vitest"
import { parseFunction } from "./parse.ts"

describe("parseFunction", () => {
  const funcs = [
    {
      path: "/tmp/tasks.ts",
      name: "deploy",
      description: "Deploy to an environment",
      parameters: [
        {
          name: "env",
          type: "string" as const,
          required: true,
          description: "",
        },
        {
          name: "dryRun",
          type: "boolean" as const,
          required: false,
          default: false,
          description: "",
        },
      ],
    },
    {
      path: "/tmp/tasks.ts",
      name: "build",
      description: "Build the project",
      parameters: [
        {
          name: "watch",
          type: "boolean" as const,
          required: true,
          description: "",
        },
        {
          name: "concurrency",
          type: "number" as const,
          required: false,
          default: 4,
          description: "",
        },
      ],
    },
  ]

  it("should match command by name", () => {
    const result = parseFunction(funcs, ["deploy", "--env", "production"])
    expect(result.func.name).toBe("deploy")
  })

  it("should parse string arguments", () => {
    const result = parseFunction(funcs, ["deploy", "--env", "production"])
    expect(result.args.env).toBe("production")
  })

  it("should parse boolean flags", () => {
    const result = parseFunction(funcs, [
      "deploy",
      "--env",
      "prod",
      "--dry-run",
    ])
    expect(result.args.dryRun).toBe(true)
  })

  it("should convert kebab-case to camelCase", () => {
    const result = parseFunction(funcs, [
      "deploy",
      "--env",
      "prod",
      "--dry-run",
    ])
    expect(result.args).toHaveProperty("dryRun")
  })

  it("should parse number arguments", () => {
    const result = parseFunction(funcs, [
      "build",
      "--watch",
      "--concurrency",
      "8",
    ])
    expect(result.args.concurrency).toBe(8)
  })

  it("should apply defaults for missing arguments", () => {
    const result = parseFunction(funcs, ["build", "--watch"])
    expect(result.args.concurrency).toBe(4)
  })

  it("should throw for unknown command", () => {
    expect(() => parseFunction(funcs, ["unknown"])).toThrow(
      "Unknown command: unknown",
    )
  })
})

describe("parseFunction with arrays", () => {
  const funcs = [
    {
      path: "/tmp/tasks.ts",
      name: "run",
      description: "",
      parameters: [
        {
          name: "tags",
          type: "string[]" as const,
          required: true,
          description: "",
        },
        {
          name: "ports",
          type: "number[]" as const,
          required: true,
          description: "",
        },
      ],
    },
  ]

  it("should collect repeated string flags into arrays", () => {
    const result = parseFunction(funcs, [
      "run",
      "--tags",
      "foo",
      "--tags",
      "bar",
    ])
    expect(result.args.tags).toEqual(["foo", "bar"])
  })

  it("should collect repeated number flags into arrays", () => {
    const result = parseFunction(funcs, [
      "run",
      "--ports",
      "3000",
      "--ports",
      "4000",
    ])
    expect(result.args.ports).toEqual([3000, 4000])
  })
})

describe("parseFunction with object", () => {
  const funcs = [
    {
      path: "/tmp/tasks.ts",
      name: "configure",
      description: "",
      parameters: [
        {
          name: "config",
          type: "object" as const,
          required: true,
          description: "",
        },
      ],
    },
  ]

  it("should parse JSON string for object type", () => {
    const result = parseFunction(funcs, [
      "configure",
      "--config",
      '{"key":"val"}',
    ])
    expect(result.args.config).toEqual({ key: "val" })
  })
})

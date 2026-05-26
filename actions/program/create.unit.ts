import { describe, expect, it, vi } from "vite-plus/test"
import type { Function } from "../../models/function.ts"
import type { Module } from "../../models/module.ts"
import { MAX_MODULES } from "../../settings.ts"
import { defineConfig } from "../config/define.ts"
import { parseModules } from "../module/parse.ts"
import { searchModules } from "../module/search.ts"
import { createProgram } from "./create.ts"

vi.mock("../module/search.ts", () => ({
  searchModules: vi.fn(() => []),
}))

vi.mock("../module/parse.ts", () => ({
  parseModules: vi.fn(() => []),
}))

function fn(path: string, name: string): Function {
  return { path, name, description: "", parameters: [] }
}

describe("createProgram", () => {
  it("should create program with config defaults", () => {
    const config = defineConfig({})
    const program = createProgram(config)
    expect(program.name()).toBe("uptask")
    expect(program.version()).toBe("0.0.0-dev")
  })

  it("should call setupProgram hook", () => {
    const hook = vi.fn()
    const config = defineConfig({ setupProgram: hook })
    createProgram(config)
    expect(hook).toHaveBeenCalledOnce()
    expect(hook.mock.calls[0]?.[0]).toBeDefined()
  })

  it("should use config name, version, description", () => {
    const config = defineConfig({
      name: "my-cli",
      version: "2.0.0",
      description: "My CLI tool",
    })
    const program = createProgram(config)
    expect(program.name()).toBe("my-cli")
    expect(program.version()).toBe("2.0.0")
    expect(program.description()).toBe("My CLI tool")
  })

  it("should attach ungrouped functions at the top level", () => {
    vi.mocked(searchModules).mockReturnValueOnce([{ path: "/tasks/@tasks.ts" }])
    vi.mocked(parseModules).mockReturnValueOnce([
      fn("/tasks/@tasks.ts", "deploy"),
      fn("/tasks/@tasks.ts", "build"),
    ])
    const program = createProgram(defineConfig({}))
    expect(program.commands.map(c => c.name())).toEqual(["deploy", "build"])
  })

  it("should attach matched files under a group parent", () => {
    vi.mocked(searchModules).mockReturnValueOnce([
      { path: "/tasks/@db.ts" },
      { path: "/tasks/@misc.ts" },
    ])
    vi.mocked(parseModules).mockImplementation((modules: Module[]) =>
      modules.flatMap(m =>
        m.path.endsWith("@db.ts")
          ? [fn(m.path, "migrate"), fn(m.path, "seed")]
          : [fn(m.path, "lint")],
      ),
    )
    const config = defineConfig({
      groups: [{ name: "db", pattern: "@db*.ts" }],
    })
    const program = createProgram(config)
    vi.mocked(parseModules).mockReset()
    vi.mocked(parseModules).mockReturnValue([])

    const names = program.commands.map(c => c.name())
    expect(names).toContain("lint")
    expect(names).toContain("db")

    const db = program.commands.find(c => c.name() === "db")
    expect(db?.commands.map(c => c.name())).toEqual(["migrate", "seed"])
  })

  it("should skip groups whose pattern matches nothing", () => {
    vi.mocked(searchModules).mockReturnValueOnce([{ path: "/tasks/@tasks.ts" }])
    vi.mocked(parseModules).mockReturnValueOnce([fn("/tasks/@tasks.ts", "run")])
    const config = defineConfig({
      groups: [{ name: "db", pattern: "@db*.ts" }],
    })
    const program = createProgram(config)
    expect(program.commands.map(c => c.name())).not.toContain("db")
  })

  it("should throw when discovery exceeds MAX_MODULES", () => {
    const overLimit = Array.from({ length: MAX_MODULES + 1 }, (_, i) => ({
      path: `/tasks/@f${i}.ts`,
    }))
    vi.mocked(searchModules).mockReturnValueOnce(overLimit)
    expect(() => createProgram(defineConfig({}))).toThrow(
      `Discovered ${MAX_MODULES + 1} task modules`,
    )
  })

  it("should accept exactly MAX_MODULES modules", () => {
    const atLimit = Array.from({ length: MAX_MODULES }, (_, i) => ({
      path: `/tasks/@f${i}.ts`,
    }))
    vi.mocked(searchModules).mockReturnValueOnce(atLimit)
    vi.mocked(parseModules).mockReturnValueOnce([])
    expect(() => createProgram(defineConfig({}))).not.toThrow()
  })

  it("should preserve declaration order for group subcommands", () => {
    vi.mocked(searchModules).mockReturnValueOnce([
      { path: "/tasks/@db.ts" },
      { path: "/tasks/@build.ts" },
    ])
    vi.mocked(parseModules).mockImplementation((modules: Module[]) =>
      modules.map(m => fn(m.path, m.path.endsWith("@db.ts") ? "migrate" : "run")),
    )
    const config = defineConfig({
      groups: [
        { name: "build", pattern: "@build*.ts" },
        { name: "db", pattern: "@db*.ts" },
      ],
    })
    const program = createProgram(config)
    vi.mocked(parseModules).mockReset()
    vi.mocked(parseModules).mockReturnValue([])

    const groupNames = program.commands
      .map(c => c.name())
      .filter(n => n === "db" || n === "build")
    expect(groupNames).toEqual(["build", "db"])
  })
})

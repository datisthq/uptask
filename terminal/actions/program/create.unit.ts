import { describe, expect, it, vi } from "vite-plus/test"
import { defineConfig } from "../config/define.ts"
import { createProgram } from "./create.ts"

vi.mock("../module/search.ts", () => ({
  searchModules: () => [],
}))

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
})

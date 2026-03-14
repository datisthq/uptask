import { describe, expect, it } from "vitest"
import { defineConfig } from "./define.ts"

describe("defineConfig", () => {
  it("should return defaults for empty object", () => {
    const config = defineConfig({})
    expect(config.name).toBe("uptask")
    expect(config.version).toBe("0.0.0-dev")
    expect(config.pattern).toBe("@*.ts")
  })

  it("should override individual fields", () => {
    const config = defineConfig({ name: "custom" })
    expect(config.name).toBe("custom")
    expect(config.pattern).toBe("@*.ts")
  })

  it("should validate setupProgram is a function", () => {
    const hook = () => {}
    const config = defineConfig({ setupProgram: hook })
    expect(config.setupProgram).toBe(hook)
  })

  it("should reject invalid field types", () => {
    expect(() =>
      defineConfig({ name: 123 } as unknown as { name: string }),
    ).toThrow()
  })

  it("should preserve all defaults when only pattern provided", () => {
    const config = defineConfig({ pattern: "*.ts" })
    expect(config.name).toBe("uptask")
    expect(config.version).toBe("0.0.0-dev")
    expect(config.pattern).toBe("*.ts")
  })
})

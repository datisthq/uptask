import { describe, expect, it } from "vite-plus/test"
import { groupModules } from "./group.ts"

const mod = (name: string) => ({ path: `/tasks/${name}` })

describe("groupModules", () => {
  it("should put every module in ungrouped when no declarations", () => {
    const modules = [mod("@a.ts"), mod("@b.ts")]
    const { groups, ungrouped } = groupModules(modules, [])
    expect(groups).toEqual([])
    expect(ungrouped).toEqual(modules)
  })

  it("should route a matching module into its group", () => {
    const modules = [mod("@db.ts"), mod("@other.ts")]
    const { groups, ungrouped } = groupModules(modules, [
      { name: "db", pattern: "@db*.ts" },
    ])
    expect(groups).toHaveLength(1)
    expect(groups[0]?.modules).toEqual([mod("@db.ts")])
    expect(ungrouped).toEqual([mod("@other.ts")])
  })

  it("should assign first matching declaration when multiple match", () => {
    const modules = [mod("@db.ts")]
    const { groups } = groupModules(modules, [
      { name: "first", pattern: "@*.ts" },
      { name: "second", pattern: "@db*.ts" },
    ])
    expect(groups[0]?.modules).toEqual([mod("@db.ts")])
    expect(groups[1]?.modules).toEqual([])
  })

  it("should return ungrouped when module matches no declaration", () => {
    const modules = [mod("@misc.ts")]
    const { groups, ungrouped } = groupModules(modules, [
      { name: "db", pattern: "@db*.ts" },
    ])
    expect(groups[0]?.modules).toEqual([])
    expect(ungrouped).toEqual(modules)
  })

  it("should handle empty modules input", () => {
    const { groups, ungrouped } = groupModules(
      [],
      [{ name: "db", pattern: "@db*.ts" }],
    )
    expect(groups[0]?.modules).toEqual([])
    expect(ungrouped).toEqual([])
  })

  it("should preserve declaration order in the output groups", () => {
    const modules = [mod("@db.ts"), mod("@build.ts")]
    const { groups } = groupModules(modules, [
      { name: "build", pattern: "@build*.ts" },
      { name: "db", pattern: "@db*.ts" },
    ])
    expect(groups.map(g => g.name)).toEqual(["build", "db"])
  })

  it("should carry the declared pattern on each group", () => {
    const { groups } = groupModules([], [{ name: "db", pattern: "@db*.ts" }])
    expect(groups[0]?.pattern).toBe("@db*.ts")
  })
})

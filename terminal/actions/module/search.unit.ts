import fs from "node:fs"
import os from "node:os"
import { join } from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { searchModules } from "./search.ts"

const fixturesDir = join(import.meta.dirname, "../../fixtures")

describe("searchModules", () => {
  it("should discover files matching default pattern", () => {
    const original = process.cwd()
    process.chdir(fixturesDir)
    try {
      const files = searchModules("*.ts")
      expect(files.length).toBeGreaterThan(0)
      for (const file of files) {
        expect(file.path).toMatch(/\.ts$/)
      }
    } finally {
      process.chdir(original)
    }
  })

  describe("gitignore", () => {
    let tmpDir: string
    const originalCwd = process.cwd()

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(join(os.tmpdir(), "searchpaths-"))
    })

    afterEach(() => {
      process.chdir(originalCwd)
      fs.rmSync(tmpDir, { recursive: true })
    })

    it("should exclude files matching root .gitignore patterns", () => {
      fs.writeFileSync(join(tmpDir, "keep.ts"), "")
      fs.writeFileSync(join(tmpDir, "debug.log"), "")
      fs.writeFileSync(join(tmpDir, ".gitignore"), "*.log\n")

      process.chdir(tmpDir)
      const files = searchModules("*")

      expect(files).toEqual([{ path: join(tmpDir, "keep.ts") }])
    })

    it("should exclude files matching nested .gitignore patterns", () => {
      const subDir = join(tmpDir, "sub")
      fs.mkdirSync(subDir)

      fs.writeFileSync(join(tmpDir, "root.ts"), "")
      fs.writeFileSync(join(subDir, "keep.ts"), "")
      fs.writeFileSync(join(subDir, "temp.dat"), "")
      fs.writeFileSync(join(subDir, ".gitignore"), "*.dat\n")

      process.chdir(tmpDir)
      const files = searchModules("*")

      expect(files).toEqual([
        { path: join(tmpDir, "root.ts") },
        { path: join(subDir, "keep.ts") },
      ])
    })

    it("should exclude directories matching .gitignore patterns", () => {
      const buildDir = join(tmpDir, "build")
      fs.mkdirSync(buildDir)

      fs.writeFileSync(join(tmpDir, "keep.ts"), "")
      fs.writeFileSync(join(buildDir, "output.ts"), "")
      fs.writeFileSync(join(tmpDir, ".gitignore"), "build/\n")

      process.chdir(tmpDir)
      const files = searchModules("*.ts")

      expect(files).toEqual([{ path: join(tmpDir, "keep.ts") }])
    })
  })
})

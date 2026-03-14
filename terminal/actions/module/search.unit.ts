import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { searchModules } from "./search.ts"

const fixturesDir = path.resolve(import.meta.dirname, "../function/fixtures")

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
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "searchpaths-"))
    })

    afterEach(() => {
      process.chdir(originalCwd)
      fs.rmSync(tmpDir, { recursive: true })
    })

    it("should exclude files matching root .gitignore patterns", () => {
      fs.writeFileSync(path.join(tmpDir, "keep.ts"), "")
      fs.writeFileSync(path.join(tmpDir, "debug.log"), "")
      fs.writeFileSync(path.join(tmpDir, ".gitignore"), "*.log\n")

      process.chdir(tmpDir)
      const files = searchModules("*")

      expect(files).toEqual([{ path: path.join(tmpDir, "keep.ts") }])
    })

    it("should exclude files matching nested .gitignore patterns", () => {
      const subDir = path.join(tmpDir, "sub")
      fs.mkdirSync(subDir)

      fs.writeFileSync(path.join(tmpDir, "root.ts"), "")
      fs.writeFileSync(path.join(subDir, "keep.ts"), "")
      fs.writeFileSync(path.join(subDir, "temp.dat"), "")
      fs.writeFileSync(path.join(subDir, ".gitignore"), "*.dat\n")

      process.chdir(tmpDir)
      const files = searchModules("*")

      expect(files).toEqual([
        { path: path.join(tmpDir, "root.ts") },
        { path: path.join(subDir, "keep.ts") },
      ])
    })

    it("should exclude directories matching .gitignore patterns", () => {
      const buildDir = path.join(tmpDir, "build")
      fs.mkdirSync(buildDir)

      fs.writeFileSync(path.join(tmpDir, "keep.ts"), "")
      fs.writeFileSync(path.join(buildDir, "output.ts"), "")
      fs.writeFileSync(path.join(tmpDir, ".gitignore"), "build/\n")

      process.chdir(tmpDir)
      const files = searchModules("*.ts")

      expect(files).toEqual([{ path: path.join(tmpDir, "keep.ts") }])
    })
  })
})

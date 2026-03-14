import fs from "node:fs"
import path, { join } from "node:path"
import { temporaryDirectory } from "tempy"
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
      tmpDir = temporaryDirectory()
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

    it("should return empty array when no files match pattern", () => {
      fs.writeFileSync(join(tmpDir, "readme.md"), "")

      process.chdir(tmpDir)
      const files = searchModules("*.ts")

      expect(files).toEqual([])
    })

    it("should exclude .git directory", () => {
      const gitDir = join(tmpDir, ".git")
      fs.mkdirSync(gitDir)

      fs.writeFileSync(join(tmpDir, "keep.ts"), "")
      fs.writeFileSync(join(gitDir, "config.ts"), "")

      process.chdir(tmpDir)
      const files = searchModules("*.ts")

      expect(files).toEqual([{ path: join(tmpDir, "keep.ts") }])
    })

    it("should handle empty .gitignore file", () => {
      fs.writeFileSync(join(tmpDir, "file.ts"), "")
      fs.writeFileSync(join(tmpDir, ".gitignore"), "")

      process.chdir(tmpDir)
      const files = searchModules("*.ts")

      expect(files).toEqual([{ path: join(tmpDir, "file.ts") }])
    })

    it("should handle .gitignore with comments", () => {
      fs.writeFileSync(join(tmpDir, "app.ts"), "")
      fs.writeFileSync(join(tmpDir, "debug.log"), "")
      fs.writeFileSync(join(tmpDir, ".gitignore"), "# comment\n*.log\n")

      process.chdir(tmpDir)
      const files = searchModules("*")

      expect(files).toEqual([{ path: join(tmpDir, "app.ts") }])
    })

    it("should handle multiple gitignore files (root + nested)", () => {
      const subDir = join(tmpDir, "sub")
      fs.mkdirSync(subDir)

      fs.writeFileSync(join(tmpDir, "keep.ts"), "")
      fs.writeFileSync(join(tmpDir, "debug.log"), "")
      fs.writeFileSync(join(tmpDir, ".gitignore"), "*.log\n")
      fs.writeFileSync(join(subDir, "keep.ts"), "")
      fs.writeFileSync(join(subDir, "temp.bak"), "")
      fs.writeFileSync(join(subDir, ".gitignore"), "*.bak\n")

      process.chdir(tmpDir)
      const files = searchModules("*")

      expect(files).toEqual([
        { path: join(tmpDir, "keep.ts") },
        { path: join(subDir, "keep.ts") },
      ])
    })

    it("should sort results alphabetically", () => {
      fs.writeFileSync(join(tmpDir, "zebra.ts"), "")
      fs.writeFileSync(join(tmpDir, "alpha.ts"), "")
      fs.writeFileSync(join(tmpDir, "middle.ts"), "")

      process.chdir(tmpDir)
      const files = searchModules("*.ts")
      const names = files.map(f => path.basename(f.path))

      expect(names).toEqual(["alpha.ts", "middle.ts", "zebra.ts"])
    })

    it("should match complex glob patterns", () => {
      fs.writeFileSync(join(tmpDir, "@tasks.ts"), "")
      fs.writeFileSync(join(tmpDir, "other.ts"), "")

      process.chdir(tmpDir)
      const files = searchModules("@*.ts")

      expect(files).toEqual([{ path: join(tmpDir, "@tasks.ts") }])
    })

    it("should return full absolute paths", () => {
      fs.writeFileSync(join(tmpDir, "file.ts"), "")

      process.chdir(tmpDir)
      const files = searchModules("*.ts")

      expect(path.isAbsolute(files[0]?.path ?? "")).toBe(true)
    })
  })
})

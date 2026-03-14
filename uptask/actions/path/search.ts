import fs from "node:fs"
import path from "node:path"
import { fdir } from "fdir"
import ignore from "ignore"
import picomatch from "picomatch"
import type { File } from "../../models/file.ts"

interface GitignoreRule {
  ig: ReturnType<typeof ignore>
  base: string
}

/**
 * Scan the filesystem for files matching a glob pattern, respecting `.gitignore` rules.
 */
export function searchPaths(pattern = "@*.ts"): File[] {
  const cwd = path.resolve(".")
  const rules = collectGitignoreRules(cwd)
  const matcher = picomatch(pattern)

  const paths = new fdir()
    .withFullPaths()
    .exclude((dirName, dirPath) => {
      if (dirName === ".git") return true
      return isPathIgnored(path.join(dirPath, dirName), rules)
    })
    .filter(filePath => {
      if (!matcher(filePath.split("/").pop() ?? "")) return false
      return !isPathIgnored(filePath, rules)
    })
    .crawl(".")
    .sync()

  return paths.sort().map(p => ({ path: p }))
}

function collectGitignoreRules(cwd: string): GitignoreRule[] {
  const rules: GitignoreRule[] = []
  const seen = new Set<string>()

  let dir = cwd
  while (true) {
    const gitignorePath = path.join(dir, ".gitignore")
    if (fs.existsSync(gitignorePath)) {
      const content = fs.readFileSync(gitignorePath, "utf-8")
      rules.push({ ig: ignore().add(content), base: dir })
      seen.add(dir)
    }
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }

  const nestedPaths = new fdir()
    .withFullPaths()
    .exclude((dirName, dirPath) => {
      if (dirName === ".git") return true
      return isPathIgnored(path.join(dirPath, dirName), rules)
    })
    .filter(filePath => filePath.endsWith("/.gitignore"))
    .crawl(cwd)
    .sync()

  for (const gitignorePath of nestedPaths) {
    const base = path.dirname(gitignorePath)
    if (seen.has(base)) continue
    const content = fs.readFileSync(gitignorePath, "utf-8")
    rules.push({ ig: ignore().add(content), base })
  }

  return rules
}

function isPathIgnored(absPath: string, rules: GitignoreRule[]): boolean {
  for (const rule of rules) {
    if (!absPath.startsWith(`${rule.base}/`)) continue
    const relPath = path.relative(rule.base, absPath)
    if (rule.ig.ignores(relPath)) return true
  }
  return false
}

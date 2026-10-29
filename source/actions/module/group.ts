import path from "node:path"
import picomatch from "picomatch"
import type { Config } from "../../models/config.ts"
import type { Group } from "../../models/group.ts"
import type { Module } from "../../models/module.ts"

export interface GroupedModules {
  groups: Group[]
  ungrouped: Module[]
}

/**
 * Partition modules into declared groups by matching their basenames against
 * each group's pattern. First declaration wins; modules matching no group
 * fall into `ungrouped`.
 */
export function groupModules(
  modules: Module[],
  declarations: Config["groups"],
): GroupedModules {
  const groups: Group[] = declarations.map(d => ({ ...d, modules: [] }))
  const matchers = groups.map(g => picomatch(g.pattern))
  const ungrouped: Module[] = []

  for (const module of modules) {
    const basename = path.basename(module.path)
    const hitIndex = matchers.findIndex(match => match(basename))
    const hit = hitIndex === -1 ? undefined : groups[hitIndex]
    if (hit) {
      hit.modules.push(module)
    } else {
      ungrouped.push(module)
    }
  }

  return { groups, ungrouped }
}

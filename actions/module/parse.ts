import type { Function } from "../../models/function.ts"
import type { Module } from "../../models/module.ts"
import { parseFunctions } from "../function/parse.ts"
import { createProject } from "../project/create.ts"

/**
 * Extract exported functions with signatures from a batch of modules,
 * reusing a single ts-morph project for the whole set.
 */
export function parseModules(modules: Module[]): Function[] {
  const project = createProject()
  return modules.flatMap(module => parseFunctions(module, project))
}

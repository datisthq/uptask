import { Project } from "ts-morph"

/**
 * Create a fresh ts-morph project configured for parsing task modules.
 */
export function createProject(): Project {
  return new Project({ compilerOptions: { strict: true } })
}

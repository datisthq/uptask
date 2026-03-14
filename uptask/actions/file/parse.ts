import { Project, SyntaxKind } from "ts-morph"
import type { File } from "../../models/file.ts"
import type { Function } from "../../models/function.ts"
import type { Parameter, ParameterType } from "../../models/parameter.ts"

/**
 * Parse a TypeScript file and extract its exported functions with signatures.
 */
export function parseFile(path: string): File {
  const project = new Project({ compilerOptions: { strict: true } })
  const sourceFile = project.addSourceFileAtPath(path)
  const functions: Function[] = []

  for (const funcDecl of sourceFile.getFunctions()) {
    if (!funcDecl.isExported()) continue

    const name = funcDecl.getName()
    if (!name) continue

    const jsDocs = funcDecl.getJsDocs()
    const description =
      jsDocs.length > 0 ? (jsDocs[0]?.getDescription().trim() ?? "") : ""

    const paramTags = new Map<string, string>()
    for (const doc of jsDocs) {
      for (const tag of doc.getTags()) {
        if (tag.getTagName() === "param") {
          const comment = tag.getCommentText() ?? ""
          const nameNode = tag.getChildrenOfKind(SyntaxKind.Identifier)[1]
          if (nameNode) {
            paramTags.set(nameNode.getText(), comment)
          } else {
            const match = tag.getText().match(/@param\s+(\w+)\s+(.*)/)
            if (match?.[1] && match[2]) paramTags.set(match[1], match[2].trim())
          }
        }
      }
    }

    const parameters: Parameter[] = funcDecl.getParameters().map(param => {
      const paramName = param.getName()
      const paramType = resolveParameterType(param.getType().getText())
      const hasDefault = param.hasInitializer()
      const isOptional = param.isOptional()
      const defaultValue = hasDefault
        ? evalDefault(param.getInitializer()?.getText() ?? "")
        : undefined

      return {
        name: paramName,
        type: paramType,
        required: !isOptional && !hasDefault,
        ...(defaultValue !== undefined ? { default: defaultValue } : {}),
        description: paramTags.get(paramName) ?? "",
      }
    })

    functions.push({ name, description, parameters })
  }

  return { path, functions }
}

function resolveParameterType(typeText: string): ParameterType {
  if (typeText === "string") return "string"
  if (typeText === "number") return "number"
  if (typeText === "boolean") return "boolean"
  if (typeText === "string[]") return "string[]"
  if (typeText === "number[]") return "number[]"
  return "object"
}

function evalDefault(text: string): unknown {
  if (text === "true") return true
  if (text === "false") return false
  if (text === "undefined") return undefined
  const num = Number(text)
  if (!Number.isNaN(num)) return num
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    return text.slice(1, -1)
  }
  return text
}

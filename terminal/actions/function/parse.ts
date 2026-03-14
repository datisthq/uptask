import { Project, SyntaxKind, type Type } from "ts-morph"
import type { Function } from "../../models/function.ts"
import type { Module } from "../../models/module.ts"
import type { Parameter, ParameterType } from "../../models/parameter.ts"

/**
 * Extract exported functions with signatures from a module.
 */
export function parseFunctions(module: Module): Function[] {
  const project = new Project({ compilerOptions: { strict: true } })
  const sourceFile = project.addSourceFileAtPath(module.path)
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
      const type = param.getType()
      const paramType = resolveParameterType(type.getText())
      const hasDefault = param.hasInitializer()
      const isOptional = param.isOptional()
      const defaultValue = hasDefault
        ? evalDefault(param.getInitializer()?.getText() ?? "")
        : undefined

      const properties =
        paramType === "object" ? extractObjectProperties(type) : undefined

      return {
        name: paramName,
        type: paramType,
        required: !isOptional && !hasDefault,
        ...(defaultValue !== undefined ? { default: defaultValue } : {}),
        description: paramTags.get(paramName) ?? "",
        ...(properties && properties.length > 0 ? { properties } : {}),
      }
    })

    functions.push({ path: module.path, name, description, parameters })
  }

  return functions
}

function extractObjectProperties(type: Type): Parameter[] {
  if (type.getStringIndexType() || type.getNumberIndexType()) return []

  const properties = type.getProperties()
  if (properties.length === 0) return []

  return properties.map(prop => {
    const propType = prop.getValueDeclarationOrThrow().getType()
    const resolvedType = resolveParameterType(propType.getText())
    const isOptional = prop.isOptional()

    return {
      name: prop.getName(),
      type: resolvedType,
      required: !isOptional,
      ...(resolvedType === "boolean" && !isOptional ? { default: false } : {}),
      description: "",
    }
  })
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

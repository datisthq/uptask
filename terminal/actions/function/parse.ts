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
          const tagText = tag.getText()
          const match = tagText.match(/@param\s+([\w.]+)\s+(.*)/)
          if (match?.[1] && match[2]) {
            paramTags.set(match[1], match[2].trim())
          } else {
            const comment = tag.getCommentText() ?? ""
            const nameNode = tag.getChildrenOfKind(SyntaxKind.Identifier)[1]
            if (nameNode) {
              paramTags.set(nameNode.getText(), comment)
            }
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
        paramType === "object"
          ? extractObjectProperties(type, paramTags, paramName)
          : undefined

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

function extractObjectProperties(
  type: Type,
  paramTags: Map<string, string>,
  prefix: string,
): Parameter[] {
  if (type.getStringIndexType() || type.getNumberIndexType()) return []

  const properties = type.getProperties()
  if (properties.length === 0) return []

  return properties.flatMap(prop => {
    const propName = prop.getName()
    const decl = prop.getValueDeclaration()
    if (!decl) return []
    const propType = decl.getType()
    const resolvedType = resolveParameterType(propType.getText())
    const isOptional = prop.isOptional()

    const nestedProperties =
      resolvedType === "object"
        ? extractObjectProperties(propType, paramTags, `${prefix}.${propName}`)
        : undefined

    return [
      {
        name: propName,
        type: resolvedType,
        required: !isOptional,
        ...(resolvedType === "boolean" && !isOptional
          ? { default: false }
          : {}),
        description: paramTags.get(`${prefix}.${propName}`) ?? "",
        ...(nestedProperties && nestedProperties.length > 0
          ? { properties: nestedProperties }
          : {}),
      },
    ]
  })
}

function resolveParameterType(typeText: string): ParameterType {
  const text = typeText.replace(/ \| undefined$/, "")
  if (text === "string") return "string"
  if (text === "number") return "number"
  if (text === "boolean") return "boolean"
  if (text === "string[]") return "string[]"
  if (text === "number[]") return "number[]"
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

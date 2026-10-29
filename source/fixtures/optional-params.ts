export function greet(name?: string, fallback = undefined) {
  return name ?? fallback ?? "world"
}

export function withAlias(value: unknown) {
  return value
}

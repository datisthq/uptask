/**
 * Signals that CLI input failed runtime validation. Caught at the top level
 * so the user sees a one-line reason instead of a Node stack trace.
 */
export class ValidationError extends Error {
  readonly name = "ValidationError" as const
}

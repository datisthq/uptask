export type ILogger = {
  trace: (...args: any[]) => void
  debug: (...args: any[]) => void
  info: (...args: any[]) => void
  warn: (...args: any[]) => void
  error: (...args: any[]) => void
  fatal: (...args: any[]) => void
  child: (data: Record<string, any>) => ILogger
}

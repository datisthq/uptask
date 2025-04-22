/**
 * Interface for a logger that can be used by tasks.
 * Follows standard logging levels and provides child logger functionality.
 */
export type ILogger = {
  /**
   * Log a trace message (lowest level)
   */
  trace: (...args: any[]) => void

  /**
   * Log a debug message (low level)
   */
  debug: (...args: any[]) => void

  /**
   * Log an info message (normal level)
   */
  info: (...args: any[]) => void

  /**
   * Log a warning message (medium level)
   */
  warn: (...args: any[]) => void

  /**
   * Log an error message (high level)
   */
  error: (...args: any[]) => void

  /**
   * Create a child logger with additional context data
   */
  child: (data: Record<string, any>) => ILogger
}

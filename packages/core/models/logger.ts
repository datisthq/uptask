/**
 * Interface for a logger that can be used by tasks.
 * Follows standard logging levels and provides child logger functionality.
 */
export type ILogger = {
  /**
   * Log a trace message (lowest level)
   * @param args - Arguments to log
   */
  trace: (...args: any[]) => void

  /**
   * Log a debug message (low level)
   * @param args - Arguments to log
   */
  debug: (...args: any[]) => void

  /**
   * Log an info message (normal level)
   * @param args - Arguments to log
   */
  info: (...args: any[]) => void

  /**
   * Log a warning message (medium level)
   * @param args - Arguments to log
   */
  warn: (...args: any[]) => void

  /**
   * Log an error message (high level)
   * @param args - Arguments to log
   */
  error: (...args: any[]) => void

  /**
   * Create a child logger with additional context data
   * @param data - Contextual data to attach to all log messages
   * @returns A new logger with the attached context
   */
  child: (data: Record<string, any>) => ILogger
}

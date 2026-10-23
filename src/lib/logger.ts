export type LogLevel = 'debug' | 'info' | 'warn' | 'error'
/** The lowest level that is written; `silent` writes nothing. */
export type LogThreshold = LogLevel | 'silent'

/** Extra facts about the event. Never a token, a password, an e-mail address or recipe content. */
export type LogContext = Readonly<Record<string, unknown>>

type LogWriter = (message: string, context?: LogContext) => void

export type Logger = Record<LogLevel, LogWriter>

const SEVERITY: Record<LogThreshold, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
}

export interface LogSink {
  debug: LogWriter
  info: LogWriter
  warn: LogWriter
  error: LogWriter
}

/** Builds a logger that forwards the events at or above `threshold` to `sink`. */
export function createLogger(sink: LogSink, threshold: LogThreshold): Logger {
  function writerFor(level: LogLevel): LogWriter {
    if (SEVERITY[level] < SEVERITY[threshold]) return () => undefined
    return (message, context) => {
      if (context === undefined) sink[level](message)
      else sink[level](message, context)
    }
  }

  return {
    debug: writerFor('debug'),
    info: writerFor('info'),
    warn: writerFor('warn'),
    error: writerFor('error'),
  }
}

// Quiet in production (problems only) and in tests (they assert on behaviour, not on the console).
const THRESHOLD_BY_MODE: Record<string, LogThreshold> = { production: 'warn', test: 'silent' }

/** The application's logger: the one place allowed to write to the console. */
export const logger: Logger = createLogger(
  console,
  THRESHOLD_BY_MODE[import.meta.env.MODE] ?? 'debug',
)

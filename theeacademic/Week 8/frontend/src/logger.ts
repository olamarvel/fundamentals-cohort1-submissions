type Level = 'info' | 'warn' | 'error' | 'debug'

export function log(level: Level, message: string, meta?: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    meta
  }
  // Structured log to console - in production you can forward this to an external logging service
  // Keep as JSON to make it easy to ingest by log collectors
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry))
}

import React from 'react'

type Props = {
  health: { status: string; version?: string; uptime?: number } | null
  lastResponseMs: number | null
  errorCount: number
}

export default function HealthCard({ health, lastResponseMs, errorCount }: Props) {
  return (
    <section className="card">
      <h2>Service Health</h2>
      <div className="grid">
        <div>
          <strong>Status:</strong>
          <div className={`pill ${health?.status === 'ok' ? 'ok' : 'down'}`}>
            {health?.status ?? 'unknown'}
          </div>
        </div>

        <div>
          <strong>Version:</strong>
          <div>{health?.version ?? 'n/a'}</div>
        </div>

        <div>
          <strong>Uptime:</strong>
          <div>{health?.uptime ? `${health.uptime}s` : 'n/a'}</div>
        </div>

        <div>
          <strong>Last response:</strong>
          <div>{lastResponseMs != null ? `${lastResponseMs} ms` : 'n/a'}</div>
        </div>

        <div>
          <strong>Errors:</strong>
          <div>{errorCount}</div>
        </div>
      </div>
    </section>
  )
}

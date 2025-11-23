import React, { useEffect, useState } from 'react'
import axios from 'axios'
import HealthCard from './components/HealthCard'
import { log } from './logger'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

type Health = {
  status: string
  version?: string
  uptime?: number
}

function App(): JSX.Element {
  const [health, setHealth] = useState<Health | null>(null)
  const [lastResponseMs, setLastResponseMs] = useState<number | null>(null)
  const [errorCount, setErrorCount] = useState<number>(0)

  async function fetchHealth() {
    const start = performance.now()
    try {
      const res = await axios.get(`${BACKEND_URL}/api/health`, { timeout: 3000 })
      const dur = Math.round(performance.now() - start)
      setLastResponseMs(dur)
      setHealth(res.data)
      log('info', 'fetched health', { url: `${BACKEND_URL}/api/health`, durationMs: dur })
    } catch (err) {
      const dur = Math.round(performance.now() - start)
      setLastResponseMs(dur)
      setErrorCount((c) => c + 1)
      log('error', 'health check failed', { error: String(err), durationMs: dur })
    }
  }

  useEffect(() => {
    fetchHealth()
    const id = setInterval(fetchHealth, 10000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="container">
      <header>
        <h1>DeployHub — Frontend</h1>
        <p className="muted">Observability demo: health, response times, and structured logs</p>
      </header>

      <main>
        <HealthCard
          health={health}
          lastResponseMs={lastResponseMs}
          errorCount={errorCount}
        />

        <section className="notes">
          <h3>Debug / Logs</h3>
          <p>Open your browser console to see structured logs emitted by the app.</p>
          <p>
            Backend target: <code>{BACKEND_URL}</code>
          </p>
        </section>
      </main>

      <footer>
        <small>Built with TypeScript, Vite + React</small>
      </footer>
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import './Logs.css'

function Logs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/logs')
      const data = await response.json()
      setLogs(data)
    } catch (error) {
      console.error('Failed to fetch logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const mockLogs = [
    { id: 1, timestamp: '2024-01-15 14:30:15', level: 'info', service: 'api', message: 'Server started successfully on port 5001' },
    { id: 2, timestamp: '2024-01-15 14:30:20', level: 'info', service: 'auth', message: 'User authentication successful' },
    { id: 3, timestamp: '2024-01-15 14:30:25', level: 'warning', service: 'database', message: 'Connection pool reaching limit' },
    { id: 4, timestamp: '2024-01-15 14:30:30', level: 'error', service: 'deployment', message: 'Failed to deploy to staging environment' },
    { id: 5, timestamp: '2024-01-15 14:30:35', level: 'info', service: 'monitoring', message: 'Health check completed successfully' }
  ]

  const displayLogs = logs.length > 0 ? logs : mockLogs
  const filteredLogs = displayLogs.filter(log => 
    filter === 'all' || log.level === filter
  ).map((log, index) => ({ ...log, id: log.id || index + 1 }))

  const getLevelColor = (level) => {
    switch(level) {
      case 'error': return 'var(--error-color)'
      case 'warning': return 'var(--warning-color)'
      case 'info': return 'var(--success-color)'
      default: return 'var(--text-secondary)'
    }
  }

  return (
    <div className="logs-page">
      <div className="page-header">
        <h1>System Logs</h1>
        <div className="log-controls">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <button className="btn btn-primary" onClick={fetchLogs}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="logs-container">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading logs...</p>
          </div>
        ) : (
          <div className="logs-list">
            {filteredLogs.map(log => (
              <div key={log.id} className="log-entry">
                <div className="log-timestamp">{log.timestamp}</div>
                <div 
                  className="log-level"
                  style={{ color: getLevelColor(log.level) }}
                >
                  {log.level.toUpperCase()}
                </div>
                <div className="log-service">{log.service}</div>
                <div className="log-message">{log.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Logs
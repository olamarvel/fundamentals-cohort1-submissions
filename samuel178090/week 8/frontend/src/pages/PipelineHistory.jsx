import { useState, useEffect } from 'react'
import './PipelineHistory.css'

function PipelineHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setHistory([
        {
          id: 1,
          pipeline: 'Production Deploy',
          status: 'success',
          startTime: '2024-01-15 14:30:00',
          duration: '3m 45s',
          commit: 'abc123f',
          branch: 'main',
          triggeredBy: 'john.doe',
          stages: ['build', 'test', 'deploy']
        },
        {
          id: 2,
          pipeline: 'Staging Deploy',
          status: 'failed',
          startTime: '2024-01-15 13:15:00',
          duration: '2m 10s',
          commit: 'def456a',
          branch: 'develop',
          triggeredBy: 'jane.smith',
          stages: ['build', 'test']
        },
        {
          id: 3,
          pipeline: 'Feature Branch',
          status: 'success',
          startTime: '2024-01-15 12:00:00',
          duration: '4m 20s',
          commit: 'ghi789b',
          branch: 'feature/auth',
          triggeredBy: 'bob.wilson',
          stages: ['build', 'test', 'deploy']
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredHistory = history.filter(item => 
    filter === 'all' || item.status === filter
  )

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'var(--success-color)'
      case 'failed': return 'var(--error-color)'
      case 'running': return 'var(--warning-color)'
      default: return 'var(--text-secondary)'
    }
  }

  if (loading) {
    return (
      <div className="pipeline-history-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading pipeline history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pipeline-history-page">
      <div className="page-header">
        <h1>Pipeline History</h1>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Runs</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
          </select>
        </div>
      </div>

      <div className="history-table">
        <div className="table-header">
          <div>Pipeline</div>
          <div>Status</div>
          <div>Start Time</div>
          <div>Duration</div>
          <div>Commit</div>
          <div>Triggered By</div>
          <div>Actions</div>
        </div>

        {filteredHistory.map(run => (
          <div key={run.id} className="table-row">
            <div className="pipeline-info">
              <strong>{run.pipeline}</strong>
              <small>{run.branch}</small>
            </div>
            
            <div className="status-cell">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(run.status) }}
              >
                {run.status}
              </span>
            </div>
            
            <div>{run.startTime}</div>
            <div>{run.duration}</div>
            <div className="commit-cell">
              <code>{run.commit}</code>
            </div>
            <div>{run.triggeredBy}</div>
            
            <div className="actions-cell">
              <button className="btn btn-sm">View Logs</button>
              <button className="btn btn-sm">Rerun</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PipelineHistory
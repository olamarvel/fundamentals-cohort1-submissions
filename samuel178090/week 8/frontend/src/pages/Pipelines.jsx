import { useState, useEffect } from 'react'
import { appAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './Pipelines.css'

function Pipelines() {
  const [pipelines, setPipelines] = useState([])
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  const fetchPipelines = async () => {
    try {
      const response = await appAPI.getPipelines()
      setPipelines(response.data)
    } catch (error) {
      console.error('Failed to fetch pipelines:', error)
      // Fallback to mock data
      setPipelines([
        { id: 1, name: 'Production Deploy', status: 'success', lastRun: '2 hours ago', branch: 'main', commit: 'abc123f' },
        { id: 2, name: 'Staging Deploy', status: 'running', lastRun: 'now', branch: 'develop', commit: 'def456a' },
        { id: 3, name: 'Feature Branch', status: 'failed', lastRun: '1 day ago', branch: 'feature/auth', commit: 'ghi789b' }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPipelines()
  }, [])

  const runPipeline = async (id) => {
    try {
      await appAPI.createPipeline({ pipelineId: id })
      fetchPipelines() // Refresh data
    } catch (error) {
      console.error('Failed to run pipeline:', error)
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'var(--success-color)'
      case 'running': return 'var(--warning-color)'
      case 'failed': return 'var(--error-color)'
      default: return 'var(--text-secondary)'
    }
  }

  if (loading) {
    return (
      <div className="pipelines-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading pipelines...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pipelines-page">
      <div className="page-header">
        <h1>CI/CD Pipelines</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'pipeline-history' }))}>View History</button>
          <button className="btn btn-primary" onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'create-pipeline' }))}>Create Pipeline</button>
        </div>
      </div>

      <div className="pipelines-grid">
        {pipelines.map(pipeline => (
          <div key={pipeline.id} className="pipeline-card">
            <div className="pipeline-header">
              <h3>{pipeline.name}</h3>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(pipeline.status) }}
              >
                {pipeline.status}
              </span>
            </div>
            
            <div className="pipeline-details">
              <div className="detail-item">
                <span className="label">Branch:</span>
                <span className="value">{pipeline.branch}</span>
              </div>
              <div className="detail-item">
                <span className="label">Commit:</span>
                <span className="value">{pipeline.commit}</span>
              </div>
              <div className="detail-item">
                <span className="label">Duration:</span>
                <span className="value">{pipeline.duration}</span>
              </div>
              <div className="detail-item">
                <span className="label">Last Run:</span>
                <span className="value">{pipeline.lastRun}</span>
              </div>
            </div>

            <div className="pipeline-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'logs' }))}
              >
                View Logs
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => runPipeline(pipeline.id)}
                disabled={!isAdmin && pipeline.status === 'running'}
              >
                {pipeline.status === 'running' ? 'Running...' : 'Run Pipeline'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pipelines
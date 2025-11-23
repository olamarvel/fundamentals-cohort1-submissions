import { useState, useEffect } from 'react'
import './Deployment.css'

function Deployment() {
  const [deployments, setDeployments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeployments()
  }, [])

  const fetchDeployments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/deployments`)
      const data = await response.json()
      setDeployments(data)
    } catch (error) {
      console.error('Failed to fetch deployments:', error)
      setDeployments([
        {
          id: 1,
          environment: 'Production',
          status: 'success',
          version: 'v1.2.3',
          deployedAt: '2024-01-15 14:30:00',
          deployedBy: 'john.doe',
          duration: '3m 45s',
          health: 'healthy'
        },
        {
          id: 2,
          environment: 'Staging',
          status: 'running',
          version: 'v1.2.4-beta',
          deployedAt: '2024-01-15 15:00:00',
          deployedBy: 'jane.smith',
          duration: '1m 20s',
          health: 'deploying'
        }
      ])
    } finally {
      setLoading(false)
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

  const getHealthIcon = (health) => {
    switch(health) {
      case 'healthy': return '💚'
      case 'deploying': return '🔄'
      case 'unhealthy': return '💔'
      default: return '❓'
    }
  }

  const deployToEnvironment = async (env) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/deployments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ environment: env })
      })
      const newDeployment = await response.json()
      setDeployments([newDeployment, ...deployments])
    } catch (error) {
      console.error('Failed to deploy:', error)
    }
  }

  const rollbackDeployment = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/deployments/${id}/rollback`, { method: 'POST' })
      const updatedDeployment = await response.json()
      setDeployments(deployments.map(dep => 
        dep.id === id ? updatedDeployment : dep
      ))
    } catch (error) {
      console.error('Failed to rollback:', error)
    }
  }

  if (loading) {
    return (
      <div className="deployment-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading deployments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="deployment-page">
      <div className="page-header">
        <h1>Deployments</h1>
        <div className="deploy-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => deployToEnvironment('Staging')}
          >
            Deploy to Staging
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => deployToEnvironment('Production')}
          >
            Deploy to Production
          </button>
        </div>
      </div>

      <div className="deployments-grid">
        {deployments.map(deployment => (
          <div key={deployment.id} className="deployment-card">
            <div className="deployment-header">
              <div className="env-info">
                <h3>{deployment.environment}</h3>
                <span className="version">{deployment.version}</span>
              </div>
              <div className="health-status">
                <span className="health-icon">{getHealthIcon(deployment.health)}</span>
                <span className="health-text">{deployment.health}</span>
              </div>
            </div>

            <div className="deployment-status">
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(deployment.status) }}
              >
                {deployment.status}
              </span>
              <span className="duration">{deployment.duration}</span>
            </div>

            <div className="deployment-details">
              <div className="detail-item">
                <span className="label">Deployed At:</span>
                <span className="value">{deployment.deployedAt}</span>
              </div>
              <div className="detail-item">
                <span className="label">Deployed By:</span>
                <span className="value">{deployment.deployedBy}</span>
              </div>
            </div>

            <div className="deployment-actions">
              <button className="btn btn-sm btn-secondary">View Logs</button>
              <button className="btn btn-sm btn-secondary">Health Check</button>
              {deployment.status === 'success' && (
                <button 
                  className="btn btn-sm btn-warning"
                  onClick={() => rollbackDeployment(deployment.id)}
                >
                  Rollback
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Deployment
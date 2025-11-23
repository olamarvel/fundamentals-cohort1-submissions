import { useState, useEffect } from 'react'
import './Alerts.css'

function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts')
      const data = await response.json()
      setAlerts(data)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
      setAlerts([
        { id: 1, type: 'error', title: 'Deployment Failed', message: 'Production deployment failed due to test failures', time: '5 minutes ago', resolved: false },
        { id: 2, type: 'warning', title: 'High CPU Usage', message: 'CPU usage above 80% for 10 minutes', time: '15 minutes ago', resolved: false },
        { id: 3, type: 'info', title: 'Deployment Success', message: 'Staging deployment completed successfully', time: '1 hour ago', resolved: true }
      ])
    } finally {
      setLoading(false)
    }
  }

  const resolveAlert = async (id) => {
    try {
      await fetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: true })
      })
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, resolved: true } : alert
      ))
    } catch (error) {
      console.error('Failed to resolve alert:', error)
    }
  }

  const getAlertIcon = (type) => {
    switch(type) {
      case 'error': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      default: return '📢'
    }
  }

  const getAlertColor = (type) => {
    switch(type) {
      case 'error': return 'var(--error-color)'
      case 'warning': return 'var(--warning-color)'
      case 'info': return 'var(--primary-color)'
      default: return 'var(--text-secondary)'
    }
  }

  if (loading) {
    return (
      <div className="alerts-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading alerts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="alerts-page">
      <div className="page-header">
        <h1>System Alerts</h1>
        <div className="alert-stats">
          <span className="stat">
            <span className="count">{alerts.filter(a => !a.resolved).length}</span>
            Active
          </span>
          <span className="stat">
            <span className="count">{alerts.filter(a => a.resolved).length}</span>
            Resolved
          </span>
        </div>
      </div>

      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-card ${alert.resolved ? 'resolved' : ''}`}>
            <div className="alert-icon" style={{ color: getAlertColor(alert.type) }}>
              {getAlertIcon(alert.type)}
            </div>
            
            <div className="alert-content">
              <div className="alert-header">
                <h3>{alert.title}</h3>
                <span className="alert-time">{alert.time}</span>
              </div>
              <p className="alert-message">{alert.message}</p>
              <div className="alert-type">{alert.type.toUpperCase()}</div>
            </div>

            <div className="alert-actions">
              {!alert.resolved && (
                <button 
                  className="btn btn-primary"
                  onClick={() => resolveAlert(alert.id)}
                >
                  Resolve
                </button>
              )}
              {alert.resolved && (
                <span className="resolved-badge">✓ Resolved</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Alerts
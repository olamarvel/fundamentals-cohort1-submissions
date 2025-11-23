import { useState, useEffect } from 'react'
import { appAPI } from '../services/api'
import './Monitoring.css'

function Monitoring() {
  const [systemData, setSystemData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSystemData()
    const interval = setInterval(fetchSystemData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSystemData = async () => {
    try {
      const [infoRes, metricsRes, statusRes] = await Promise.all([
        appAPI.getInfo(),
        appAPI.getMetrics(),
        appAPI.getStatus()
      ])
      
      setSystemData({
        info: infoRes.data,
        metrics: metricsRes.data,
        status: statusRes.data
      })
      setError(null)
    } catch (err) {
      setError('Failed to fetch system data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="monitoring-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading system metrics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="monitoring-page">
        <div className="error-container">
          <h2>⚠️ Connection Error</h2>
          <p>{error}</p>
          <button onClick={fetchSystemData} className="btn btn-primary">Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className="monitoring-page">
      <div className="page-header">
        <h1>System Monitoring</h1>
        <div className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="monitoring-grid">
        {/* System Health */}
        <div className="metric-card">
          <div className="card-header">
            <h3>System Health</h3>
            <div className="status-dot success"></div>
          </div>
          <div className="metric-content">
            <div className="metric-item">
              <span className="label">Status:</span>
              <span className="value success">{systemData?.status?.status || 'Unknown'}</span>
            </div>
            <div className="metric-item">
              <span className="label">Uptime:</span>
              <span className="value">{systemData?.info?.uptime || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="label">Version:</span>
              <span className="value">{systemData?.info?.version || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="metric-card">
          <div className="card-header">
            <h3>Service Status</h3>
            <div className="status-dot success"></div>
          </div>
          <div className="metric-content">
            <div className="metric-item">
              <span className="label">Service:</span>
              <span className="value">{systemData?.info?.service || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="label">Status:</span>
              <span className="value success">{systemData?.status?.status || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="label">Environment:</span>
              <span className="value">{systemData?.info?.environment || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="label">Last Check:</span>
              <span className="value">{systemData?.info?.lastCheck || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="metric-card">
          <div className="card-header">
            <h3>System Metrics</h3>
            <div className="status-dot success"></div>
          </div>
          <div className="metric-content">
            <div className="metric-item">
              <span className="label">App Version:</span>
              <span className="value">{systemData?.metrics?.version?.app || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="label">Node Version:</span>
              <span className="value">{systemData?.metrics?.version?.node || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="label">Build Time:</span>
              <span className="value">{systemData?.info?.buildTime || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="label">Memory Total:</span>
              <span className="value">{systemData?.metrics?.memory?.total || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="metric-card">
          <div className="card-header">
            <h3>Memory Usage</h3>
            <div className="status-dot success"></div>
          </div>
          <div className="metric-content">
            <div className="metric-item">
              <span className="label">Total Memory:</span>
              <span className="value">{systemData?.metrics?.memory?.total || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="label">Heap Used:</span>
              <span className="value">{systemData?.metrics?.memory?.heap || 'N/A'}</span>
            </div>
            <div className="metric-item">
              <span className="label">External:</span>
              <span className="value">{systemData?.metrics?.memory?.external || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Monitoring
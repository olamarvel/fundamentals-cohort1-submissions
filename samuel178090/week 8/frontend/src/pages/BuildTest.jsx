import { useState, useEffect } from 'react'
import './BuildTest.css'

function BuildTest() {
  const [builds, setBuilds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBuilds()
  }, [])

  const fetchBuilds = async () => {
    try {
      const response = await fetch('/api/builds')
      const data = await response.json()
      setBuilds(data)
    } catch (error) {
      console.error('Failed to fetch builds:', error)
      setBuilds([
        {
          id: 1,
          name: 'Frontend Build',
          status: 'success',
          duration: '2m 30s',
          tests: { passed: 45, failed: 0, total: 45 },
          coverage: '92%',
          branch: 'main',
          commit: 'abc123f'
        },
        {
          id: 2,
          name: 'Backend Build',
          status: 'running',
          duration: '1m 15s',
          tests: { passed: 32, failed: 2, total: 34 },
          coverage: '88%',
          branch: 'develop',
          commit: 'def456a'
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return '✅'
      case 'running': return '🔄'
      case 'failed': return '❌'
      default: return '⏸️'
    }
  }

  const runBuild = async (id) => {
    try {
      await fetch(`/api/builds/${id}/run`, { method: 'POST' })
      setBuilds(builds.map(build => 
        build.id === id 
          ? { ...build, status: 'running', duration: '0s' }
          : build
      ))
    } catch (error) {
      console.error('Failed to run build:', error)
    }
  }

  if (loading) {
    return (
      <div className="build-test-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading build status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="build-test-page">
      <div className="page-header">
        <h1>Build & Test</h1>
        <button className="btn btn-primary">Run All Tests</button>
      </div>

      <div className="builds-grid">
        {builds.map(build => (
          <div key={build.id} className="build-card">
            <div className="build-header">
              <div className="build-info">
                <h3>{build.name}</h3>
                <div className="build-meta">
                  <span>{build.branch}</span>
                  <code>{build.commit}</code>
                </div>
              </div>
              <div className="build-status">
                <span className="status-icon">{getStatusIcon(build.status)}</span>
                <span 
                  className="status-text"
                  style={{ color: getStatusColor(build.status) }}
                >
                  {build.status}
                </span>
              </div>
            </div>

            <div className="build-stats">
              <div className="stat-item">
                <span className="label">Duration</span>
                <span className="value">{build.duration}</span>
              </div>
              <div className="stat-item">
                <span className="label">Coverage</span>
                <span className="value">{build.coverage}</span>
              </div>
            </div>

            <div className="test-results">
              <h4>Test Results</h4>
              <div className="test-stats">
                <div className="test-stat success">
                  <span className="count">{build.tests.passed}</span>
                  <span className="label">Passed</span>
                </div>
                <div className="test-stat failed">
                  <span className="count">{build.tests.failed}</span>
                  <span className="label">Failed</span>
                </div>
                <div className="test-stat total">
                  <span className="count">{build.tests.total}</span>
                  <span className="label">Total</span>
                </div>
              </div>
            </div>

            <div className="build-actions">
              <button className="btn btn-secondary">View Logs</button>
              <button 
                className="btn btn-primary"
                onClick={() => runBuild(build.id)}
                disabled={build.status === 'running'}
              >
                {build.status === 'running' ? 'Running...' : 'Run Build'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuildTest
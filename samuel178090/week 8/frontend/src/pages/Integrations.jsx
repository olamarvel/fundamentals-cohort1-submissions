import { useState } from 'react'
import './Integrations.css'

function Integrations() {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'GitHub',
      icon: '🐙',
      status: 'connected',
      description: 'Source code repository integration',
      lastSync: '2 minutes ago',
      config: { repo: 'deployhub/main', webhooks: 'enabled' }
    },
    {
      id: 2,
      name: 'Docker Hub',
      icon: '🐳',
      status: 'connected',
      description: 'Container registry for Docker images',
      lastSync: '5 minutes ago',
      config: { registry: 'deployhub/backend', autoBuilds: 'enabled' }
    },
    {
      id: 3,
      name: 'Slack',
      icon: '💬',
      status: 'disconnected',
      description: 'Team notifications and alerts',
      lastSync: 'Never',
      config: { channel: '#deployments', notifications: 'disabled' }
    },
    {
      id: 4,
      name: 'AWS',
      icon: '☁️',
      status: 'connected',
      description: 'Cloud infrastructure and services',
      lastSync: '1 minute ago',
      config: { region: 'us-east-1', services: 'EC2, S3, RDS' }
    },
    {
      id: 5,
      name: 'Prometheus',
      icon: '📊',
      status: 'connected',
      description: 'Metrics collection and monitoring',
      lastSync: '30 seconds ago',
      config: { endpoint: '/metrics', scrapeInterval: '15s' }
    },
    {
      id: 6,
      name: 'Grafana',
      icon: '📈',
      status: 'pending',
      description: 'Metrics visualization and dashboards',
      lastSync: 'Pending setup',
      config: { dashboards: '0', alerts: '0' }
    }
  ])

  const getStatusColor = (status) => {
    switch(status) {
      case 'connected': return 'var(--success-color)'
      case 'pending': return 'var(--warning-color)'
      case 'disconnected': return 'var(--error-color)'
      default: return 'var(--text-secondary)'
    }
  }

  const handleConnect = (id) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: 'connected', lastSync: 'Just now' }
          : integration
      )
    )
  }

  const handleDisconnect = (id) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, status: 'disconnected', lastSync: 'Disconnected' }
          : integration
      )
    )
  }

  return (
    <div className="integrations-page">
      <div className="page-header">
        <h1>Integrations</h1>
        <p>Connect your favorite tools and services</p>
      </div>

      <div className="integrations-grid">
        {integrations.map(integration => (
          <div key={integration.id} className="integration-card">
            <div className="integration-header">
              <div className="integration-info">
                <div className="integration-icon">{integration.icon}</div>
                <div>
                  <h3>{integration.name}</h3>
                  <p className="integration-description">{integration.description}</p>
                </div>
              </div>
              <div 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(integration.status) }}
              >
                {integration.status}
              </div>
            </div>

            <div className="integration-details">
              <div className="detail-item">
                <span className="label">Last Sync:</span>
                <span className="value">{integration.lastSync}</span>
              </div>
              
              <div className="config-section">
                <h4>Configuration</h4>
                {Object.entries(integration.config).map(([key, value]) => (
                  <div key={key} className="config-item">
                    <span className="config-key">{key}:</span>
                    <span className="config-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="integration-actions">
              {integration.status === 'connected' ? (
                <>
                  <button className="btn btn-secondary">Configure</button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => handleDisconnect(integration.id)}
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary">Setup</button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleConnect(integration.id)}
                  >
                    Connect
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="add-integration">
        <div className="add-card">
          <div className="add-icon">➕</div>
          <h3>Add New Integration</h3>
          <p>Connect more tools to enhance your CI/CD pipeline</p>
          <button className="btn btn-primary">Browse Integrations</button>
        </div>
      </div>
    </div>
  )
}

export default Integrations
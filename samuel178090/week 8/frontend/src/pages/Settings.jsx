import { useState, useEffect } from 'react'
import './Settings.css'

function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      slack: false,
      webhook: true
    },
    deployment: {
      autoRollback: true,
      healthCheckTimeout: 300,
      approvalRequired: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 3600,
      apiKeyExpiry: 90
    }
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleToggle = (section, key) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key]
      }
    }))
  }

  const handleNumberChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: parseInt(value) || 0
      }
    }))
  }

  const saveSettings = async () => {
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    }
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
        <button className="btn btn-primary" onClick={saveSettings}>
          Save Changes
        </button>
      </div>

      <div className="settings-sections">
        {/* Notifications */}
        <div className="settings-section">
          <h2>🔔 Notifications</h2>
          <div className="setting-item">
            <div className="setting-info">
              <label>Email Notifications</label>
              <p>Receive deployment and alert notifications via email</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleToggle('notifications', 'email')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Slack Integration</label>
              <p>Send notifications to Slack channels</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.slack}
                onChange={() => handleToggle('notifications', 'slack')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Webhook Notifications</label>
              <p>Send notifications to configured webhooks</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.notifications.webhook}
                onChange={() => handleToggle('notifications', 'webhook')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Deployment */}
        <div className="settings-section">
          <h2>🚀 Deployment</h2>
          <div className="setting-item">
            <div className="setting-info">
              <label>Auto Rollback</label>
              <p>Automatically rollback failed deployments</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.deployment.autoRollback}
                onChange={() => handleToggle('deployment', 'autoRollback')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Health Check Timeout</label>
              <p>Timeout for health checks in seconds</p>
            </div>
            <input
              type="number"
              className="number-input"
              value={settings.deployment.healthCheckTimeout}
              onChange={(e) => handleNumberChange('deployment', 'healthCheckTimeout', e.target.value)}
            />
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Approval Required</label>
              <p>Require manual approval for production deployments</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.deployment.approvalRequired}
                onChange={() => handleToggle('deployment', 'approvalRequired')}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="settings-section">
          <h2>🔒 Security</h2>
          <div className="setting-item">
            <div className="setting-info">
              <label>Two-Factor Authentication</label>
              <p>Enable 2FA for enhanced security</p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.security.twoFactor}
                onChange={() => handleToggle('security', 'twoFactor')}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>Session Timeout</label>
              <p>Session timeout in seconds</p>
            </div>
            <input
              type="number"
              className="number-input"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleNumberChange('security', 'sessionTimeout', e.target.value)}
            />
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <label>API Key Expiry</label>
              <p>API key expiry in days</p>
            </div>
            <input
              type="number"
              className="number-input"
              value={settings.security.apiKeyExpiry}
              onChange={(e) => handleNumberChange('security', 'apiKeyExpiry', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
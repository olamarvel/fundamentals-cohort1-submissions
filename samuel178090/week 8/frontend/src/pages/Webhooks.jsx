import { useState, useEffect } from 'react'
import './Webhooks.css'

function Webhooks() {
  const [webhooks, setWebhooks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    events: ['push', 'pull_request'],
    active: true
  })

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const fetchWebhooks = async () => {
    try {
      const response = await fetch('/api/webhooks')
      const data = await response.json()
      setWebhooks(data)
    } catch (error) {
      setWebhooks([
        { id: 1, name: 'GitHub Deploy', url: 'https://api.github.com/webhook', active: true, events: ['push'] },
        { id: 2, name: 'Slack Notify', url: 'https://hooks.slack.com/webhook', active: false, events: ['deployment'] }
      ])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const newWebhook = {
        id: Date.now(),
        ...formData
      }
      setWebhooks([...webhooks, newWebhook])
      setFormData({ name: '', url: '', events: ['push'], active: true })
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create webhook:', error)
    }
  }

  const toggleWebhook = async (id) => {
    try {
      const webhook = webhooks.find(w => w.id === id)
      await fetch(`/api/webhooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...webhook, active: !webhook.active })
      })
      setWebhooks(webhooks.map(webhook => 
        webhook.id === id 
          ? { ...webhook, active: !webhook.active }
          : webhook
      ))
    } catch (error) {
      console.error('Failed to toggle webhook:', error)
    }
  }

  const deleteWebhook = async (id) => {
    try {
      await fetch(`/api/webhooks/${id}`, { method: 'DELETE' })
      setWebhooks(webhooks.filter(webhook => webhook.id !== id))
    } catch (error) {
      console.error('Failed to delete webhook:', error)
    }
  }

  return (
    <div className="webhooks-page">
      <div className="page-header">
        <h1>Webhooks</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Add Webhook
        </button>
      </div>

      {showForm && (
        <div className="webhook-form-overlay">
          <div className="webhook-form">
            <h3>Create New Webhook</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Events</label>
                <div className="checkbox-group">
                  {['push', 'pull_request', 'deployment', 'release'].map(event => (
                    <label key={event} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.events.includes(event)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, events: [...formData.events, event]})
                          } else {
                            setFormData({...formData, events: formData.events.filter(e => e !== event)})
                          }
                        }}
                      />
                      {event}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="webhooks-grid">
        {webhooks.map(webhook => (
          <div key={webhook.id} className="webhook-card">
            <div className="webhook-header">
              <h3>{webhook.name}</h3>
              <div className="webhook-status">
                <span className={`status-dot ${webhook.active ? 'active' : 'inactive'}`}></span>
                {webhook.active ? 'Active' : 'Inactive'}
              </div>
            </div>

            <div className="webhook-details">
              <div className="detail-item">
                <span className="label">URL:</span>
                <span className="value">{webhook.url}</span>
              </div>
              <div className="detail-item">
                <span className="label">Events:</span>
                <span className="value">{webhook.events?.join(', ') || 'push'}</span>
              </div>
            </div>

            <div className="webhook-actions">
              <button 
                className={`btn ${webhook.active ? 'btn-warning' : 'btn-success'}`}
                onClick={() => toggleWebhook(webhook.id)}
              >
                {webhook.active ? 'Disable' : 'Enable'}
              </button>
              <button className="btn btn-secondary">Test</button>
              <button 
                className="btn btn-danger"
                onClick={() => deleteWebhook(webhook.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Webhooks
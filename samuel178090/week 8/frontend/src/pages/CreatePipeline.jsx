import { useState } from 'react'
import './CreatePipeline.css'

function CreatePipeline() {
  const [formData, setFormData] = useState({
    name: '',
    repository: '',
    branch: 'main',
    buildCommand: 'npm run build',
    testCommand: 'npm test',
    deployTarget: 'production',
    notifications: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch('/api/pipelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      alert('Pipeline created successfully!')
      // Navigate back to pipelines
      window.dispatchEvent(new CustomEvent('navigate', { detail: 'pipelines' }))
    } catch (error) {
      console.error('Failed to create pipeline:', error)
      alert('Failed to create pipeline')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="create-pipeline-page">
      <div className="page-header">
        <h1>Create New Pipeline</h1>
        <p>Set up a new CI/CD pipeline for your project</p>
      </div>

      <form onSubmit={handleSubmit} className="pipeline-form">
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label>Pipeline Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="My Awesome Pipeline"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Repository URL</label>
            <input
              type="url"
              name="repository"
              value={formData.repository}
              onChange={handleChange}
              placeholder="https://github.com/user/repo"
              required
            />
          </div>

          <div className="form-group">
            <label>Branch</label>
            <select name="branch" value={formData.branch} onChange={handleChange}>
              <option value="main">main</option>
              <option value="develop">develop</option>
              <option value="master">master</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Build Configuration</h3>
          <div className="form-group">
            <label>Build Command</label>
            <input
              type="text"
              name="buildCommand"
              value={formData.buildCommand}
              onChange={handleChange}
              placeholder="npm run build"
            />
          </div>

          <div className="form-group">
            <label>Test Command</label>
            <input
              type="text"
              name="testCommand"
              value={formData.testCommand}
              onChange={handleChange}
              placeholder="npm test"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Deployment</h3>
          <div className="form-group">
            <label>Deploy Target</label>
            <select name="deployTarget" value={formData.deployTarget} onChange={handleChange}>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
              />
              Enable notifications
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary">Create Pipeline</button>
        </div>
      </form>
    </div>
  )
}

export default CreatePipeline
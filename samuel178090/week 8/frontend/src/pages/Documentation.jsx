import { useState, useEffect } from 'react'
import './Documentation.css'

function Documentation() {
  const [docSections, setDocSections] = useState([])
  const [quickLinks, setQuickLinks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocumentation()
  }, [])

  const fetchDocumentation = async () => {
    try {
      const [sectionsRes, linksRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/docs/sections`),
        fetch(`${import.meta.env.VITE_API_URL}/api/docs/links`)
      ])
      const sections = await sectionsRes.json()
      const links = await linksRes.json()
      setDocSections(sections)
      setQuickLinks(links)
    } catch (error) {
      console.error('Failed to fetch documentation:', error)
      // Fallback data
      setDocSections([
        {
          title: 'Getting Started',
          icon: '🚀',
          description: 'Quick start guide to set up your first pipeline',
          items: ['Installation & Setup', 'Creating Your First Pipeline', 'Connecting to GitHub', 'Basic Configuration']
        }
      ])
      setQuickLinks([
        { title: 'GitHub Repository', url: '#', icon: '🐙' }
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="documentation-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading documentation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="documentation-page">
      <div className="page-header">
        <h1>Documentation</h1>
        <p>Everything you need to know about DeployHub CI/CD Platform</p>
      </div>

      <div className="search-section">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search documentation..." 
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      <div className="docs-grid">
        {docSections.map((section, index) => (
          <div key={index} className="doc-card">
            <div className="doc-header">
              <div className="doc-icon">{section.icon}</div>
              <div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>
            </div>
            
            <div className="doc-items">
              {section.items.map((item, idx) => (
                <a key={idx} href="#" className="doc-item">
                  <span className="item-icon">📄</span>
                  <span>{item}</span>
                  <span className="arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="quick-links-section">
        <h2>Quick Links</h2>
        <div className="quick-links-grid">
          {quickLinks.map((link, index) => (
            <a 
              key={index} 
              href={link.url} 
              className="quick-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="link-icon">{link.icon}</div>
              <span>{link.title}</span>
              <span className="external-icon">↗</span>
            </a>
          ))}
        </div>
      </div>

      <div className="help-section">
        <div className="help-card">
          <h3>Need More Help?</h3>
          <p>Can't find what you're looking for? Our support team is here to help.</p>
          <div className="help-actions">
            <button className="btn btn-primary">Contact Support</button>
            <button className="btn btn-secondary">Join Community</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Documentation
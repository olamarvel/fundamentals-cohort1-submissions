import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

function Navbar({ onNavigate, currentPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout, isAdmin } = useAuth()

  const navSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/'
    },
    {
      id: 'pipelines',
      label: 'Pipelines',
      icon: '🔄',
      path: '/pipelines',
      dropdown: [
        { label: 'All Pipelines', path: '/pipelines' },
        { label: 'Create Pipeline', path: '/pipelines/create' },
        { label: 'Pipeline History', path: '/pipelines/history' },
        { label: 'Failed Pipelines', path: '/pipelines/failed' }
      ]
    },
    {
      id: 'features',
      label: 'Features',
      icon: '⚡',
      path: '/features',
      dropdown: [
        { label: 'Source Integration', path: '/features/source' },
        { label: 'Build & Test', path: '/features/build' },
        { label: 'Deployment', path: '/features/deploy' },
        { label: 'Monitoring', path: '/features/monitoring' }
      ]
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: '📈',
      path: '/monitoring',
      dropdown: [
        { label: 'System Metrics', path: '/monitoring/metrics' },
        { label: 'Logs', path: '/monitoring/logs' },
        { label: 'Health Checks', path: '/monitoring/health' },
        { label: 'Alerts', path: '/monitoring/alerts' }
      ]
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: '🔌',
      path: '/integrations',
      dropdown: [
        { label: 'GitHub', path: '/integrations/github' },
        { label: 'Docker', path: '/integrations/docker' },
        { label: 'Webhooks', path: '/integrations/webhooks' },
        { label: 'API Keys', path: '/integrations/api' }
      ]
    },
    {
      id: 'documentation',
      label: 'Documentation',
      icon: '📚',
      path: '/docs'
    }
  ]

  const handleNavClick = (sectionId, path) => {
    if (onNavigate) {
      // Handle sub-navigation
      if (path) {
        const pageMap = {
          '/pipelines/create': 'create-pipeline',
          '/pipelines/history': 'pipeline-history',
          '/features/build': 'build-test',
          '/features/deploy': 'deployment',
          '/monitoring/logs': 'logs',
          '/monitoring/alerts': 'alerts',
          '/integrations/webhooks': 'webhooks',
          '/settings': 'settings'
        }
        onNavigate(pageMap[path] || sectionId)
      } else {
        onNavigate(sectionId)
      }
    }
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <div className="logo-icon">🚀</div>
          <div className="logo-text">
            <span className="logo-primary">DeployHub</span>
            <span className="logo-secondary">CI/CD Platform</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {navSections.map(section => (
            <div
              key={section.id}
              className={`nav-item ${currentPage === section.id ? 'active' : ''} ${section.dropdown ? 'has-dropdown' : ''}`}
            >
              <button
                className="nav-link"
                onClick={() => handleNavClick(section.id, section.path)}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
                {section.dropdown && <span className="dropdown-arrow">▼</span>}
              </button>

              {/* Dropdown Menu */}
              {section.dropdown && (
                <div className="dropdown-menu">
                  {section.dropdown.map((item, index) => (
                    <button
                      key={`${section.id}-${item.path}-${index}`}
                      className="dropdown-item"
                      onClick={() => handleNavClick(section.id, item.path)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Section - Actions */}
        <div className="navbar-actions">
          <button className="action-btn notification-btn">
            <span className="icon">🔔</span>
            <span className="badge">3</span>
          </button>
          
          <button className="action-btn settings-btn">
            <span className="icon">⚙️</span>
          </button>

          <div className="user-menu">
            <button className="user-btn">
              <div className="user-avatar">{isAdmin ? '👑' : '👤'}</div>
              <span className="user-name">{user?.username}</span>
              <span className="user-role">({user?.role})</span>
              <span className="dropdown-arrow">▼</span>
            </button>
            <div className="user-dropdown">
              <button className="dropdown-item">Profile</button>
              <button 
                className="dropdown-item"
                onClick={() => handleNavClick('settings', '/settings')}
              >
                Settings
              </button>
              {isAdmin && (
                <button 
                  className="dropdown-item"
                  onClick={() => handleNavClick('admin-panel', '/admin')}
                >
                  Admin Panel
                </button>
              )}
              <button className="dropdown-item">API Keys</button>
              <hr />
              <button className="dropdown-item logout" onClick={logout}>Sign Out</button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="hamburger">{mobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          <span className="status-dot success"></span>
          <span className="status-text">All Systems Operational</span>
        </div>
        <div className="status-item">
          <span className="status-label">Last Deploy:</span>
          <span className="status-value">2 hours ago</span>
        </div>
        <div className="status-item">
          <span className="status-label">Active Pipelines:</span>
          <span className="status-value">3</span>
        </div>
        <div className="status-item">
          <span className="status-label">Region:</span>
          <span className="status-value">US-EAST-1</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
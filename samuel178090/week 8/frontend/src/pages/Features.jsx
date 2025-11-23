import './Features.css'

function Features() {
  const features = [
    {
      icon: '🔗',
      title: 'Source Integration',
      description: 'Connect seamlessly with GitHub, GitLab, and other version control systems',
      details: [
        'Automatic webhook triggers',
        'Branch-based workflows',
        'Pull request validation',
        'Monorepo support'
      ]
    },
    {
      icon: '🏗️',
      title: 'Build & Test Automation',
      description: 'Automated building and testing with every code commit',
      details: [
        'Multi-environment builds',
        'Parallel test execution',
        'Code coverage tracking',
        'Docker containerization'
      ]
    },
    {
      icon: '🚀',
      title: 'Continuous Deployment',
      description: 'Deploy to multiple environments with confidence',
      details: [
        'Blue-green deployments',
        'Rolling updates',
        'Automated rollbacks',
        'Multi-region support'
      ]
    },
    {
      icon: '📊',
      title: 'Real-time Monitoring',
      description: 'Track your deployments and system health in real-time',
      details: [
        'Prometheus metrics',
        'Winston logging',
        'Performance tracking',
        'Error monitoring'
      ]
    }
  ]

  return (
    <div className="features-page">
      <section className="features-hero">
        <div className="hero-content">
          <h1>Powerful CI/CD Features</h1>
          <p className="hero-subtitle">
            Everything you need to build, test, and deploy your applications with confidence
          </p>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Core Features</h2>
            <p>Enterprise-grade CI/CD capabilities for modern development teams</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <ul className="feature-details">
                  {feature.details.map((detail, idx) => (
                    <li key={idx}>
                      <span className="check-icon">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Features
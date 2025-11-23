import { useState, useEffect } from 'react'
import './App.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import AuthWrapper from './components/AuthWrapper'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Features from './pages/Features'
import Pipelines from './pages/Pipelines'
import CreatePipeline from './pages/CreatePipeline'
import PipelineHistory from './pages/PipelineHistory'
import Monitoring from './pages/Monitoring'
import Logs from './pages/Logs'
import Alerts from './pages/Alerts'
import BuildTest from './pages/BuildTest'
import Deployment from './pages/Deployment'
import Integrations from './pages/Integrations'
import Webhooks from './pages/Webhooks'
import Settings from './pages/Settings'
import Documentation from './pages/Documentation'

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const { isAuthenticated, loading } = useAuth()

  useEffect(() => {
    const handleNavigate = (event) => {
      setCurrentPage(event.detail)
    }
    
    window.addEventListener('navigate', handleNavigate)
    return () => window.removeEventListener('navigate', handleNavigate)
  }, [])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthWrapper />
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'features':
        return <Features />
      case 'pipelines':
        return <Pipelines />
      case 'create-pipeline':
        return <CreatePipeline />
      case 'pipeline-history':
        return <PipelineHistory />
      case 'monitoring':
        return <Monitoring />
      case 'logs':
        return <Logs />
      case 'alerts':
        return <Alerts />
      case 'build-test':
        return <BuildTest />
      case 'deployment':
        return <Deployment />
      case 'integrations':
        return <Integrations />
      case 'webhooks':
        return <Webhooks />
      case 'settings':
        return <Settings />
      case 'documentation':
        return <Documentation />
      case 'admin-panel':
        return <Settings />
      default:
        return (
          <div className="coming-soon">
            <h2>Coming Soon: {currentPage}</h2>
            <p>This section is under development</p>
          </div>
        )
    }
  }

  return (
    <div className="app">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      
      <main className="app-main">
        {renderPage()}
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ using React + Vite | Backend: Node.js + Express</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
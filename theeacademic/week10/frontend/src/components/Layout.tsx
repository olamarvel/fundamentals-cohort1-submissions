import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="logo">SyncForge</h1>
          <nav className="nav">
            <Link to="/" className={isActive('/')}>
              Dashboard
            </Link>
            <Link to="/projects" className={isActive('/projects')}>
              Projects
            </Link>
            <Link to="/team" className={isActive('/team')}>
              Team
            </Link>
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
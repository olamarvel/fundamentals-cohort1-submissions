import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="nav-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1>PayVerse</h1>
          <span style={{ 
            backgroundColor: '#dbeafe', 
            color: '#1d4ed8', 
            padding: '4px 8px', 
            borderRadius: '12px', 
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {user?.role === 'admin' ? 'ADMIN' : 'USER'}
          </span>
        </div>
        {user && (
          <div className="nav-links">
            <span style={{ color: '#374151' }}>
              👤 {user.email}
            </span>
            <button onClick={logout} className="btn btn-primary" style={{ padding: '8px 16px' }}>
              🚪 Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
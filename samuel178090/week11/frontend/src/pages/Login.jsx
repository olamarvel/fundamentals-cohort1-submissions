import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(credentials);
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', margin: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2563eb', marginBottom: '8px' }}>PayVerse</h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Secure Payment Platform</p>
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>Sign In to Your Account</h2>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', marginRight: '8px' }}></div>
                Signing In...
              </>
            ) : 'Sign In'}
          </button>
        </form>
        

        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '12px' }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: '#2563eb', fontWeight: '600' }}>
              Sign Up
            </a>
          </p>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>
            Secure • Encrypted • Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
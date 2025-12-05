import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.register(formData);
      // Auto-login after successful registration
      localStorage.setItem('token', response.data.token);
      await login({ email: formData.email, password: formData.password });
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '450px', width: '100%', margin: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#2563eb', marginBottom: '8px' }}>PayVerse</h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Create Your Account</p>
        </div>
        
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>Join PayVerse Today</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
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
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-success" 
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', marginRight: '8px' }}></div>
                Creating Account...
              </>
            ) : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#2563eb', fontWeight: '600' }}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
// src/components/Login.js
import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.username);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Logo */}
        <div className="logo-container">
          <svg width="150" height="45" viewBox="0 0 150 45">
            <text x="5" y="26" fontFamily="Arial Black, sans-serif" fontSize="21" fontWeight="900" fill="#2D7A3E">KAARD</text>
            <text x="5" y="39" fontFamily="Arial, sans-serif" fontSize="8" fill="#4CAF50" letterSpacing="1.5">INVESTMENTS</text>
          </svg>
        </div>

        <h1>Welcome Back</h1>
        <h3>Sign in to access the farm management system</h3>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button 
            type="button"
            onClick={handleSubmit}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="login-hint">
          Credentials: admin / admin***
        </p>
      </div>
    </div>
  );
}

export default Login;
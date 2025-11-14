// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

// Import components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CropManagement from './components/CropManagement';
import EquipmentManagement from './components/EquipmentManagement';
import ProductionTracking from './components/ProductionTracking';
import VehicleTracking from './components/VehicleTracking';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [username, setUsername] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    const savedUsername = localStorage.getItem('username');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      setUsername(savedUsername || 'Admin');
    }
  }, []);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUsername(user);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', user);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setCurrentPage('dashboard');
    setShowLogin(false);
  };

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'crops':
        return <CropManagement />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'production':
        return <ProductionTracking />;
      case 'vehicles':
        return <VehicleTracking />;
      default:
        return <Dashboard />;
    }
  };

  // LANDING PAGE - Show when not logged in and login not triggered
  if (!isLoggedIn && !showLogin) {
    return (
      <div className="landing-page">
        {/* Logo */}
        <div className="landing-logo">
          <svg width="200" height="60" viewBox="0 0 200 60">
            <text x="10" y="35" fontFamily="Arial Black, sans-serif" fontSize="28" fontWeight="900">KAARD</text>
            <text x="10" y="52" fontFamily="Arial, sans-serif" fontSize="11" letterSpacing="2">INVESTMENTS</text>
          </svg>
        </div>

        {/* Hero Content */}
        <div className="landing-content">
          <h1>Farm Management System</h1>
          
          <p>
            <em>"Empowering economic growth through innovative agricultural solutions"</em>
          </p>

          <button className="landing-btn" onClick={() => setShowLogin(true)}>
            Access System →
          </button>
        </div>

        {/* Footer */}
        <div className="landing-footer">
          Expert solutions in farming, transportation, and equipment hire
        </div>
      </div>
    );
  }

  // LOGIN PAGE - Show when login button clicked
  if (!isLoggedIn && showLogin) {
    return (
      <div>
        <Login onLogin={handleLogin} />
        <button 
          className="back-btn" 
          onClick={() => setShowLogin(false)}
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2rem',
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontWeight: '600',
            zIndex: 1000
          }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  // DASHBOARD - Show when logged in
  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <svg width="120" height="36" viewBox="0 0 120 36">
            <text x="2" y="21" fontFamily="Arial Black, sans-serif" fontSize="17" fontWeight="900" fill="white">KAARD</text>
            <text x="2" y="31" fontFamily="Arial, sans-serif" fontSize="6.5" fill="#C8E6C9" letterSpacing="1">INVESTMENTS</text>
          </svg>
        </div>

        <div className="nav-links">
          <button
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={currentPage === 'crops' ? 'active' : ''}
            onClick={() => setCurrentPage('crops')}
          >
            Crops
          </button>
          <button
            className={currentPage === 'equipment' ? 'active' : ''}
            onClick={() => setCurrentPage('equipment')}
          >
            Equipment
          </button>
          <button
            className={currentPage === 'production' ? 'active' : ''}
            onClick={() => setCurrentPage('production')}
          >
            Production
          </button>
          <button
            className={currentPage === 'vehicles' ? 'active' : ''}
            onClick={() => setCurrentPage('vehicles')}
          >
            Vehicles
          </button>
        </div>

        <div className="nav-user">
          <span>👤 {username}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="main-content">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
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
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [username, setUsername] = useState('');

  // Check if user is already logged in (from localStorage)
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
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setCurrentPage('dashboard');
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Render current page based on navigation
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

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h2>Kaard Farm System</h2>
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
          <span>User: {username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
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
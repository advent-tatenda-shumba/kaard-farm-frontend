// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [stats, setStats] = useState({
    cropCount: 0,
    equipmentCount: 0,
    productionCount: 0,
    vehicleCount: 0,
    totalCropQuantity: 0,
    activeVehicles: 0,
    equipmentNeedingRepair: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">CROP</div>
          <div className="stat-info">
            <h3>{stats.cropCount}</h3>
            <p>Total Crops</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">EQUIP</div>
          <div className="stat-info">
            <h3>{stats.equipmentCount}</h3>
            <p>Equipment Items</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">PROD</div>
          <div className="stat-info">
            <h3>{stats.productionCount}</h3>
            <p>Production Records</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">VEHICLE</div>
          <div className="stat-info">
            <h3>{stats.vehicleCount}</h3>
            <p>Vehicles Tracked</p>
          </div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">INVENTORY</div>
          <div className="stat-info">
            <h3>{stats.totalCropQuantity.toLocaleString()} kg</h3>
            <p>Total Inventory</p>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <h2>Welcome to Kaard Farm Management System</h2>
        <p>
          This system helps you manage farm inventory, track production,
          monitor equipment, and locate vehicles in real-time.
        </p>
        <ul>
          <li><strong>Crops:</strong> Manage your crop inventory and storage</li>
          <li><strong>Equipment:</strong> Track equipment condition and maintenance</li>
          <li><strong>Production:</strong> Record planting and harvest data</li>
          <li><strong>Vehicles:</strong> Real-time GPS tracking for tractors and trucks</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

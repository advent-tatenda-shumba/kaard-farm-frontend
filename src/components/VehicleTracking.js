// src/components/VehicleTracking.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API_URL = 'http://localhost:5000/api';

function VehicleTracking() {
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vehicleName: '',
    registration: '',
    type: '',
    driverName: '',
    fuelLevel: 100,
    status: 'Idle'
  });
  const [editingId, setEditingId] = useState(null);

  const centerPosition = [-18.9166, 29.8166];

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch(`${API_URL}/vehicles`);
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_URL}/vehicles/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_URL}/vehicles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      vehicleName: vehicle.vehicleName,
      registration: vehicle.registration,
      type: vehicle.type,
      driverName: vehicle.driverName,
      fuelLevel: vehicle.fuelLevel,
      status: vehicle.status
    });
    setEditingId(vehicle._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this vehicle?')) {
      try {
        await fetch(`${API_URL}/vehicles/${id}`, { method: 'DELETE' });
        fetchVehicles();
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const simulateMovement = async (vehicleId) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    if (!vehicle) return;

    const newLat = vehicle.currentLat + (Math.random() - 0.5) * 0.01;
    const newLng = vehicle.currentLng + (Math.random() - 0.5) * 0.01;

    try {
      await fetch(`${API_URL}/vehicles/${vehicleId}/location`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentLat: newLat, currentLng: newLng })
      });
      fetchVehicles();
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      vehicleName: '',
      registration: '',
      type: '',
      driverName: '',
      fuelLevel: 100,
      status: 'Idle'
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return '#4CAF50';
      case 'Idle': return '#FFC107';
      case 'Maintenance': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <div className="vehicle-tracking-page">
      <div className="page-header">
        <h1>Vehicle Tracking</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Vehicle Name *</label>
                <input
                  type="text"
                  value={formData.vehicleName}
                  onChange={(e) => setFormData({...formData, vehicleName: e.target.value})}
                  required
                  placeholder="e.g., Tractor 1, Truck A"
                />
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input
                  type="text"
                  value={formData.registration}
                  onChange={(e) => setFormData({...formData, registration: e.target.value})}
                  placeholder="e.g., ABC-1234"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="">Select Type</option>
                  <option value="Tractor">Tractor</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Driver Name</label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => setFormData({...formData, driverName: e.target.value})}
                  placeholder="Driver's name"
                />
              </div>
              <div className="form-group">
                <label>Fuel Level (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.fuelLevel}
                  onChange={(e) => setFormData({...formData, fuelLevel: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Idle">Idle</option>
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add Vehicle'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tracking-layout">
        <div className="map-container">
          <h3>Live Vehicle Map</h3>
          <MapContainer center={centerPosition} zoom={12} style={{ height: '500px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {vehicles.map((vehicle) => (
              <Marker
                key={vehicle._id}
                position={[vehicle.currentLat, vehicle.currentLng]}
              >
                <Popup>
                  <div className="vehicle-popup">
                    <strong>{vehicle.vehicleName}</strong><br/>
                    Registration: {vehicle.registration}<br/>
                    Status: <span style={{color: getStatusColor(vehicle.status)}}>{vehicle.status}</span><br/>
                    Fuel: {vehicle.fuelLevel}%<br/>
                    Driver: {vehicle.driverName || 'Unassigned'}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="vehicle-list">
          <h3>Vehicle List ({vehicles.length})</h3>
          {vehicles.length === 0 ? (
            <p className="empty-state">No vehicles registered.</p>
          ) : (
            <div className="vehicle-cards">
              {vehicles.map((vehicle) => (
                <div key={vehicle._id} className="vehicle-card">
                  <div className="vehicle-card-header">
                    <h4>{vehicle.vehicleName}</h4>
                    <span
                      className="status-indicator"
                      style={{backgroundColor: getStatusColor(vehicle.status)}}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                  <div className="vehicle-card-body">
                    <p><strong>Reg:</strong> {vehicle.registration || '-'}</p>
                    <p><strong>Type:</strong> {vehicle.type || '-'}</p>
                    <p><strong>Driver:</strong> {vehicle.driverName || 'Unassigned'}</p>
                    <p><strong>Fuel:</strong> {vehicle.fuelLevel}%</p>
                    <p><strong>Location:</strong> {vehicle.currentLat.toFixed(4)}, {vehicle.currentLng.toFixed(4)}</p>
                    <p><small>Updated: {new Date(vehicle.lastUpdate).toLocaleTimeString()}</small></p>
                  </div>
                  <div className="vehicle-card-actions">
                    <button
                      className="btn-simulate"
                      onClick={() => simulateMovement(vehicle._id)}
                    >
                      Simulate Move
                    </button>
                    <button className="btn-edit" onClick={() => handleEdit(vehicle)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(vehicle._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VehicleTracking;
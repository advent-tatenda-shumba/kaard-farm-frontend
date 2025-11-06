// src/components/EquipmentManagement.js
import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function EquipmentManagement() {
  const [equipment, setEquipment] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    equipmentName: '',
    equipmentType: '',
    condition: 'Working',
    lastMaintenance: '',
    location: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`${API_URL}/equipment`);
      const data = await response.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/equipment/${editingId}` : `${API_URL}/equipment`;

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      resetForm();
      fetchEquipment();
    } catch (error) {
      console.error('Error saving equipment:', error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      equipmentName: item.equipmentName,
      equipmentType: item.equipmentType,
      condition: item.condition,
      lastMaintenance: item.lastMaintenance ? item.lastMaintenance.split('T')[0] : '',
      location: item.location
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this equipment?')) {
      try {
        await fetch(`${API_URL}/equipment/${id}`, { method: 'DELETE' });
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      equipmentName: '',
      equipmentType: '',
      condition: 'Working',
      lastMaintenance: '',
      location: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Equipment Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Equipment'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Edit Equipment' : 'Add New Equipment'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Equipment Name *</label>
                <input
                  type="text"
                  value={formData.equipmentName}
                  onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                  required
                  placeholder="e.g., Tractor, Plow, Irrigation System"
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={formData.equipmentType}
                  onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                >
                  <option value="">Select Type</option>
                  <option value="Tractor">Tractor</option>
                  <option value="Harvester">Harvester</option>
                  <option value="Plow">Plow</option>
                  <option value="Irrigation">Irrigation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                >
                  <option value="Working">Working</option>
                  <option value="Needs Repair">Needs Repair</option>
                  <option value="Broken">Broken</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Last Maintenance Date</label>
                <input
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Farm Section A, Shed 2"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update' : 'Add Equipment'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table">
        <h3>Equipment List ({equipment.length})</h3>
        {equipment.length === 0 ? (
          <p className="empty-state">No equipment registered. Add equipment above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Equipment Name</th>
                <th>Type</th>
                <th>Condition</th>
                <th>Last Maintenance</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((item) => (
                <tr key={item._id}>
                  <td>{item.equipmentName}</td>
                  <td>{item.equipmentType || '-'}</td>
                  <td>
                    <span className={`status-badge ${item.condition.replace(' ', '-').toLowerCase()}`}>
                      {item.condition}
                    </span>
                  </td>
                  <td>
                    {item.lastMaintenance ? new Date(item.lastMaintenance).toLocaleDateString() : '-'}
                  </td>
                  <td>{item.location || '-'}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EquipmentManagement;

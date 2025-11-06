// src/components/CropManagement.js
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function CropManagement() {
  const [crops, setCrops] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    cropName: '',
    quantity: '',
    unit: 'kg',
    storageLocation: '',
    harvestDate: '',
    status: 'In Stock'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      const response = await fetch(`${API_URL}/crops`);
      const data = await response.json();
      setCrops(data);
    } catch (error) {
      console.error('Error fetching crops:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`${API_URL}/crops/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        await fetch(`${API_URL}/crops`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }
      resetForm();
      fetchCrops();
    } catch (error) {
      console.error('Error saving crop:', error);
      alert('Failed to save crop');
    }
  };

  const handleEdit = (crop) => {
    setFormData({
      cropName: crop.cropName,
      quantity: crop.quantity,
      unit: crop.unit,
      storageLocation: crop.storageLocation,
      harvestDate: crop.harvestDate ? crop.harvestDate.split('T')[0] : '',
      status: crop.status
    });
    setEditingId(crop._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await fetch(`${API_URL}/crops/${id}`, { method: 'DELETE' });
        fetchCrops();
      } catch (error) {
        console.error('Error deleting crop:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      cropName: '',
      quantity: '',
      unit: 'kg',
      storageLocation: '',
      harvestDate: '',
      status: 'In Stock'
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Crop Inventory Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Crop'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Edit Crop' : 'Add New Crop'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Crop Name *</label>
                <input
                  type="text"
                  value={formData.cropName}
                  onChange={(e) => setFormData({...formData, cropName: e.target.value})}
                  required
                  placeholder="e.g., Maize, Wheat, Tobacco"
                />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label>Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="tons">Tons</option>
                  <option value="bags">Bags</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Storage Location</label>
                <input
                  type="text"
                  value={formData.storageLocation}
                  onChange={(e) => setFormData({...formData, storageLocation: e.target.value})}
                  placeholder="e.g., Warehouse A, Silo 2"
                />
              </div>
              <div className="form-group">
                <label>Harvest Date</label>
                <input
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => setFormData({...formData, harvestDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Crop' : 'Add Crop'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table">
        <h3>Crop Inventory ({crops.length})</h3>
        {crops.length === 0 ? (
          <p className="empty-state">No crops in inventory. Add your first crop above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Crop Name</th>
                <th>Quantity</th>
                <th>Storage Location</th>
                <th>Harvest Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop._id}>
                  <td>{crop.cropName}</td>
                  <td>{crop.quantity} {crop.unit}</td>
                  <td>{crop.storageLocation || '-'}</td>
                  <td>{crop.harvestDate ? new Date(crop.harvestDate).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`status-badge ${crop.status.replace(' ', '-').toLowerCase()}`}>
                      {crop.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(crop)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(crop._id)}>Delete</button>
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

export default CropManagement;
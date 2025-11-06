// src/components/ProductionTracking.js
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

function ProductionTracking() {
  const [production, setProduction] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fieldNumber: '',
    cropType: '',
    plantingDate: '',
    harvestDate: '',
    areaHectares: '',
    yieldAmount: '',
    qualityGrade: ''
  });

  useEffect(() => {
    fetchProduction();
  }, []);

  const fetchProduction = async () => {
    try {
      const response = await fetch(`${API_URL}/production`);
      const data = await response.json();
      setProduction(data);
    } catch (error) {
      console.error('Error fetching production:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/production`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      resetForm();
      fetchProduction();
    } catch (error) {
      console.error('Error saving production:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this production record?')) {
      try {
        await fetch(`${API_URL}/production/${id}`, { method: 'DELETE' });
        fetchProduction();
      } catch (error) {
        console.error('Error deleting production:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fieldNumber: '',
      cropType: '',
      plantingDate: '',
      harvestDate: '',
      areaHectares: '',
      yieldAmount: '',
      qualityGrade: ''
    });
    setShowForm(false);
  };

  const calculateYieldPerHectare = (record) => {
    if (record.areaHectares && record.yieldAmount) {
      return (record.yieldAmount / record.areaHectares).toFixed(2);
    }
    return '-';
  };

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Production Tracking</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>Add Production Record</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Field Number *</label>
                <input
                  type="text"
                  value={formData.fieldNumber}
                  onChange={(e) => setFormData({...formData, fieldNumber: e.target.value})}
                  required
                  placeholder="e.g., Field A1, Plot 5"
                />
              </div>
              <div className="form-group">
                <label>Crop Type *</label>
                <input
                  type="text"
                  value={formData.cropType}
                  onChange={(e) => setFormData({...formData, cropType: e.target.value})}
                  required
                  placeholder="e.g., Maize, Wheat"
                />
              </div>
              <div className="form-group">
                <label>Area (Hectares) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.areaHectares}
                  onChange={(e) => setFormData({...formData, areaHectares: e.target.value})}
                  required
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Planting Date *</label>
                <input
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({...formData, plantingDate: e.target.value})}
                  required
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
                <label>Yield Amount (kg)</label>
                <input
                  type="number"
                  value={formData.yieldAmount}
                  onChange={(e) => setFormData({...formData, yieldAmount: e.target.value})}
                  placeholder="Total yield in kg"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quality Grade</label>
                <select
                  value={formData.qualityGrade}
                  onChange={(e) => setFormData({...formData, qualityGrade: e.target.value})}
                >
                  <option value="">Select Grade</option>
                  <option value="A">Grade A - Excellent</option>
                  <option value="B">Grade B - Good</option>
                  <option value="C">Grade C - Fair</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">Add Record</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="data-table">
        <h3>Production Records ({production.length})</h3>
        {production.length === 0 ? (
          <p className="empty-state">No production records. Add your first record above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Crop Type</th>
                <th>Area (ha)</th>
                <th>Planting Date</th>
                <th>Harvest Date</th>
                <th>Yield (kg)</th>
                <th>Yield/ha</th>
                <th>Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {production.map((record) => (
                <tr key={record._id}>
                  <td>{record.fieldNumber}</td>
                  <td>{record.cropType}</td>
                  <td>{record.areaHectares}</td>
                  <td>{record.plantingDate ? new Date(record.plantingDate).toLocaleDateString() : '-'}</td>
                  <td>{record.harvestDate ? new Date(record.harvestDate).toLocaleDateString() : 'Pending'}</td>
                  <td>{record.yieldAmount || '-'}</td>
                  <td>{calculateYieldPerHectare(record)}</td>
                  <td>
                    {record.qualityGrade ? (
                      <span className="grade-badge">Grade {record.qualityGrade}</span>
                    ) : '-'}
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(record._id)}>Delete</button>
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

export default ProductionTracking;
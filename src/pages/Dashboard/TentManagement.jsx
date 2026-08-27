import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TentManagement.css';

export default function TentManagement() {
  const [tentList, setTentList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tentId: '',
    name: '',
    description: '',
    status: 'Ready',
    price: ''
  });
  const [error, setError] = useState('');

  // Fetch tent list from server
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/tents');
        setTentList(res.data);
      } catch (err) {
        console.error('Failed to fetch tents:', err);
      }
    })();
  }, []);

  // Add new tent
  const handleAddTent = async () => {
    const { tentId, name, description, price } = formData;
    if (!tentId || !name || !description || !price) {
      setError('Please fill full form information');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/tents', formData);
      const newTent = response.data;

      setTentList((prev) => [...prev, newTent]);
      setShowModal(false);
      setFormData({ tentId: '', name: '', description: '', status: 'Ready', price: '' });
      setError('');
    } catch (err) {
      console.error('Add tent failed:', err);
      setError('Add tent failed!');
    }
  };

  return (
    <div className="tent-management">
      <div className="header">
        <h2>List of tents</h2>
        <button className="btn-add-user" onClick={() => setShowModal(true)}>+ Add Tent</button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>NO</th>
            <th>Tent ID</th>
            <th>Tent Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Price per person (VND)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tentList.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                No data available.
              </td>
            </tr>
          ) : (
            tentList.map((t, i) => (
              <tr key={t._id}>
                <td>{i + 1}</td>
                <td>{t.tentId}</td>
                <td>{t.name}</td>
                <td>{t.description}</td>
                <td>{t.status}</td>
                <td>{t.price}</td>
                <td><span className="action-link">View</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add new tent</h3>
              <button onClick={() => setShowModal(false)} className="close-button">&times;</button>
            </div>
            <div className="modal-form">
              {error && <p className="error-text">{error}</p>}
              <label>Tent ID</label>
              <input value={formData.tentId} onChange={(e) => setFormData({ ...formData, tentId: e.target.value })} />

              <label>Tent Name</label>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

              <label>Type</label>
              <input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

              <label>Price per person</label>
              <input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />

              <label>Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                <option>Ready</option>
                <option>Not ready</option>
              </select>

              <div className="modal-actions">
                <button onClick={handleAddTent} className="btn-submit">Save</button>
                <button onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

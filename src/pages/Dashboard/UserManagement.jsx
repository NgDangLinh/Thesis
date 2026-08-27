import React, { useState } from 'react';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', name: '', email: '', phone: '', note: '' });
  const [error, setError] = useState('');

  const handleAddUser = () => {
    if (!formData.username || !formData.name) {
      setError('Please fill in all required fields');
      return;
    }
    if (users.some(user => user.username === formData.username)) {
      setError('Username already exists');
      return;
    }

    const newUser = {
      id: users.length + 1,
      ...formData,
      status: 'Active',
      joinDate: new Date().toLocaleString('en-US')
    };

    setUsers([...users, newUser]);
    setShowModal(false);
    setFormData({ username: '', name: '', email: '', phone: '', note: '' });
    setError('');
  };

  return (
    <div className="user-management">
      <div className="header">
        <h2>User list</h2>
        <button className="btn-add-user" onClick={() => setShowModal(true)}>
            + Add user
        </button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Login Name</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Note</th>
            <th>Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                No Data.
              </td>
            </tr>
          ) : (
            users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>{u.username}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.status}</td>
                <td>{u.note}</td>
                <td>{u.joinDate}</td>
                <td><span className="action-link">Xem</span></td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add new user</h3>
              <span className="close-btn" onClick={() => setShowModal(false)}>×</span>
            </div>
            <div className="modal-body">
              {error && <div className="error">{error}</div>}
              <div className="form-group">
                <label>Username (*)</label>
                <input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Full Name (*)</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Note</label>
                <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="save-btn" onClick={handleAddUser}>Save</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

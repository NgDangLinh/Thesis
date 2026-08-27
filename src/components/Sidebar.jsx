import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">⚠️</div>
        <div>
          <div className="brand-title">Forest Guard Station</div>
          <div className="brand-subtitle">Camping Area Management</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🏠</span>
          <span>Overview</span>
        </NavLink>
        <NavLink to="/admin/sitemap" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">🗺️</span>
          <span>Site Map</span>
        </NavLink>
        <NavLink to="/admin/booking" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">📅</span>
          <span>Bookings</span>
        </NavLink>
        <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">👥</span>
          <span>Customers</span>
        </NavLink>
        <NavLink to="/admin/revenue" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <span className="nav-icon">💰</span>
          <span>Revenue</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-name">Admin Manager</div>
          <div className="user-role">Administrator</div>
        </div>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </aside>
  );
}

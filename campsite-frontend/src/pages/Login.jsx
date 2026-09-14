import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import heroImage from '../assets/HomePageCamping.jpg';
import { Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username && password) {
      localStorage.setItem('token', 'fake_token');
      navigate('/admin');
    } else {
      alert('Please enter both username and password!');
    }
  };

  return (
    <div
  className="login-page"
  style={{ backgroundImage: `url(${heroImage})` }}
>
      <div className="login-overlay"></div>

      <div className="login-content">
        <div className="login-brand">
          <p>MOJEN RETREAT</p>
          <span>Forest retreat & campsite</span>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <Link to="/" className="back-home">
  ← Back to Home
</Link>
            <p className="login-kicker">ADMIN PORTAL</p>
            <h1>Welcome back</h1>
            <span>Sign in to manage your campsite.</span>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
              <label htmlFor="username">Username</label>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="remember">
              <input
                type="checkbox"
                id="remember"
                defaultChecked
              />

              <label htmlFor="remember">
                Remember me
              </label>
            </div>

            <button type="submit" className="login-button">
              Log in
            </button>
          </form>
        </div>

        <div className="login-footer">
          <span>Mojen Camp</span>
          <span>Quan Chu, Thai Nguyen</span>
        </div>
      </div>
    </div>
  );
}
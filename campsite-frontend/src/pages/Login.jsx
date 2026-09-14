import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import heroImage from '../assets/HomePageCamping.jpg';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', result.data.token);
      localStorage.setItem(
        'adminUser',
        JSON.stringify(result.data.user)
      );

      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      alert('Cannot connect to server.');
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

            <span>
              Sign in to manage your campsite.
            </span>
          </div>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >
            <div className="login-field">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
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

            <button
              type="submit"
              className="login-button"
            >
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
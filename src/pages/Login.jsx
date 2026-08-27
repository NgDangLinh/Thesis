import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          LOGIN
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="remember">
            <input type="checkbox" id="remember" defaultChecked />
            <label htmlFor="remember">Remember me</label>
          </div>
          <button type="submit">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Css/AuthForm.css';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      localStorage.setItem('token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      setUser(response.data.user);
      navigate('/problems');

    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || 'Login failed');
      } else if (error.request) {
        alert('No response from server');
      } else {
        alert('Login error: ' + error.message);
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="logo-container">
            <div className="math-symbol">∫</div>
            <h2>
              Log In to <span className="highlight">MathiQ</span>
            </h2>
          </div>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">Log In</button>

          <p className="switch-link">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')} style={{ cursor: 'pointer', color: '#3a7bd5' }}>
              Sign up
            </span>
          </p>

          <hr />

          <div className="google-login">
            <button type="button" className="google-btn">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google logo"
                width="18"
                style={{ marginRight: '8px' }}
              />
              Continue with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Login.js (updated JSX only - keep existing logic)


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/AuthForm.css';

const API_URL = 'https://by-taha-website-mathiq.vercel.app/api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== passwordConfirm) {
      setError("Passwords don't match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Signup failed');
      } else {
        setMessage('Signup successful! You can now log in.');
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch {
      setError('Network error');
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSignup}>
          <div className="logo-container">
            <div className="math-symbol">Σ</div>
            <h2>
              Join <span className="highlight">MathiQ</span>
            </h2>
          </div>

          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            id="passwordConfirm"
            type="password"
            required
            minLength={6}
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button type="submit">Sign Up</button>

          <p className="switch-link">
            Already have an account?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ cursor: 'pointer', color: '#3a7bd5' }}
            >
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet, Link, useNavigate } from 'react-router-dom';

import Auth from './components/Auth';
import Login from './Js/Login';
import Signup from './Js/Signup';
import Dashboard from './Js/Dashboard';
import CreateProblem from './Js/CreateProblem';
import Problem from './Js/Problem';
import ProblemList from './Js/ProblemList';
import { useLocation } from 'react-router-dom';

const themes = {
  default: 'default-theme',
  sunset: 'sunset-theme',
  space: 'space-theme',
  morning: 'morning-theme',
  forest: 'forest-theme',
  neon: 'neon-theme',
  ice: 'ice-theme',
  candy: 'candy-theme'
};


function Layout({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    document.body.classList.remove(...Object.values(themes));
    document.body.classList.add(themes[theme]);
  }, [theme]);

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container" onClick={() => navigate('/dashboard')}>
            <div className="math-symbol">∫</div>
            <h1 className="app-title">Math<span className="highlight">iQ</span></h1>
          </div>

          <nav className="nav-links">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/problems" className={`nav-link ${isActive('/problems')}`}>
              Problems
            </Link>
            {user?.role === 'admin' && (
              <Link 
                to="/create-problem" 
                className={`nav-link ${isActive('/create-problem')}`}
              >
                Create Problem
              </Link>
            )}
          </nav>

          <div className="header-right">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="theme-selector"
            >
              <option value="default">Default</option>
              <option value="sunset">Sunset</option>
              <option value="space">Midnight Space</option>
              <option value="morning">Morning Glow</option>
              <option value="forest">Forest Mist</option>
              <option value="neon">Neon Vibes</option>
              <option value="ice">Ice Chill</option>
              <option value="candy">Candy Floss</option>

            </select>

            {user && (
              <div className="user-info">
                <span className="welcome-message">Welcome, {user.username}</span>
                {user.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={user.username} 
                    className="user-avatar"
                    width="36"
                    height="36"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} MathiQ | Visualizing Mathematical Beauty</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Auth />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />

          {/* Protected routes with layout */}
          <Route element={<Layout user={user} />}>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/problems" element={<ProblemList user={user} />} />
            <Route path="/problems/:id" element={<Problem user={user} />} />
            <Route path="/create-problem" element={<CreateProblem user={user} />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

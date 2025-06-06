import React, { useState, useEffect, useActionState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

import Auth from './components/Auth';
import Login from './Js/Login';
import Signup from './Js/Signup';
import Dashboard from './Js/Dashboard';
import CreateProblem from './Js/CreateProblem';
import Problem from './Js/Problem';
import ProblemList from './Js/ProblemList';

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  function toggleDrawer() {
    setDrawerOpen(!drawerOpen);
  }

  useEffect(() => {
    // Remove all theme classes
    Object.values(themes).forEach(themeClass => {
      document.body.classList.remove(themeClass);
    });
    // Add the selected theme class
    document.body.classList.add(themes[theme]);
  }, [theme]);

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <div className="math-symbol">∫</div>
            <h1 className="app-title">Math<span className="highlight">iQ</span></h1>
          </div>
  
          <nav className="nav-links">
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
            <Link to="/problems" className={`nav-link ${isActive('/problems')}`}>Problems</Link>
            {user?.role === 'admin' && (
              <Link to="/create-problem" className={`nav-link ${isActive('/create-problem')}`}>Create Problem</Link>
            )}
          </nav>
          <div className="header-right">
            <button className="drawer-toggle" onClick={toggleDrawer}>
              ☰
            </button>
          </div>
        </div>
      </header>
  
      <main className="app-main">
        <Outlet />
      </main>
  
      {/* Drawer Component */}
      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-content">
          <button className="close-drawer" onClick={toggleDrawer}>×</button>
          
          {user && (
            <div className="drawer-user-info">
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={`${user.username} avatar`}
                  className="drawer-user-avatar"
                  width="60"
                  height="60"
                />
              )}
              <div className="drawer-user-details">
                <h3>{user.username}</h3>
                <p className="user-role">{user.role}</p>
              </div>
            </div>
          )}
  
          <div className="theme-selector">
            <h4>Theme Preferences</h4>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              className="theme-dropdown"
            >
              {Object.keys(themes).map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                </option>
              ))}
            </select>
          </div>
  
          <div className="drawer-actions">
            <button className="logout-button" onClick={() => {
              localStorage.removeItem('user');
              navigate('/login');
              toggleDrawer();
            }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      <div 
        className={`drawer-overlay ${drawerOpen ? 'visible' : ''}`} 
        onClick={toggleDrawer}
      />
  
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

          {/* Protected routes wrapped in Layout */}
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

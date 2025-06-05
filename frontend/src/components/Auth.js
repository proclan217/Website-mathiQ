import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Css/Auth.css';

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-content">
        <div className="logo-container">
          <div className="math-symbol">∫</div>
          <h1 className="auth-title">Math<span className="highlight">iQ</span></h1>
          <p className="tagline">Visualizing the beauty of mathematics</p>
        </div>

        <div className="auth-options">
          <button 
            className="btn btn-extra"
            onClick={() => navigate('/login')}
          >
            <span className="btn-icon"></span>
            <span>Login</span>
          </button>
          <button 
            className="btn btn-extra"
            onClick={() => navigate('/signup')}
          >
            <span className="btn-icon"></span>
            <span>Sign Up</span>
          </button>
        </div>

        <div className="quick-links">
          <button className="link-btn" onClick={() => navigate('/explore')}>
            Explore Demos
          </button>
          <button className="link-btn" onClick={() => navigate('/about')}>
            About MathViz
          </button>
        </div>
      </div>
    </div>
  );
}

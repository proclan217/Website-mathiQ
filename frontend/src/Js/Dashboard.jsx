import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaBullseye, FaTasks, FaStar, FaBook, FaChartLine, FaFire } from 'react-icons/fa';
import '../Css/Dashboard.css';

const Dashboard = ({ user }) => {
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [progress, setProgress] = useState({
    completedProblems: [],
    totalProblems: 1000,
    points: 0,
    streak: 0,
    rank: 'Beginner',
  });

  useEffect(() => {
    fetch('https://by-taha-website-mathiq.vercel.app/api/dailychallenges')
      .then(res => res.json())
      .then(setDailyChallenge)
      .catch(err => console.error('Daily challenge error:', err));

    fetch('https://by-taha-website-mathiq.vercel.app/api/leaderboard')
      .then(res => res.json())
      .then(setLeaderboard)
      .catch(err => console.error('Leaderboard error:', err));

    fetch('https://by-taha-website-mathiq.vercel.app/api/progress', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch progress');
        return res.json();
      })
      .then(data => {
        setProgress({
          ...data,
          totalProblems: 1000,
          streak: data.streak || 0,
          rank: data.rank || 'Beginner'
        });
      })
      .catch(err => console.error(err.message));
  }, [user]);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.username || 'Guest'}!</h1>
        <p className="welcome-message">Track your progress, compete on the leaderboard, and conquer math challenges!</p>
        <div className="user-stats">
          <div className="stat-badge">
            <FaTrophy className="stat-icon" />
            <span className="stat-value">{progress.points} points</span>
          </div>
          <div className="stat-badge">
            <FaFire className="stat-icon" />
            <span className="stat-value">{progress.streak} day streak</span>
          </div>
          <div className="stat-badge">
            <FaChartLine className="stat-icon" />
            <span className="stat-value">{progress.rank}</span>
          </div>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-card daily-challenge">
          <div className="card-header">
            <FaStar className="card-icon" />
            <div>
              <h2>Daily Challenge</h2>
              <p className="card-subtitle">Solve today's special problem</p>
            </div>
          </div>
          {dailyChallenge ? (
            <div className="card-content">
              <h3 className="challenge-title">{dailyChallenge.title}</h3>
              <p className="challenge-description">{dailyChallenge.description}</p>
              <div className="challenge-difficulty">
                Difficulty: <span className={`difficulty-${dailyChallenge.difficulty?.toLowerCase()}`}>
                  {dailyChallenge.difficulty || 'Medium'}
                </span>
              </div>
              <Link to={`/dailychallenges/${dailyChallenge._id}`} className="btn-primary">
                Solve Now
              </Link>
            </div>
          ) : (
            <p className="loading-text">Loading today's challenge...</p>
          )}
        </section>

        <section className="dashboard-card progress">
          <div className="card-header">
            <FaTasks className="card-icon" />
            <div>
              <h2>Your Progress</h2>
              <p className="card-subtitle">Journey to mastery</p>
            </div>
          </div>
          <div className="card-content">
            <div className="progress-info">
              <span className="progress-percent">
                {Math.round((progress.completedProblems.length / progress.totalProblems) * 100)}%
              </span>
              <span className="progress-count">
                {progress.completedProblems.length} / {progress.totalProblems} problems
              </span>
            </div>
            <progress
              value={progress.completedProblems.length}
              max={progress.totalProblems}
              className="progress-bar"
            ></progress>
            <Link to="/progress" className="btn-secondary">
              View Detailed Progress
            </Link>
          </div>
        </section>

        <section className="dashboard-card leaderboard">
          <div className="card-header">
            <FaTrophy className="card-icon" />
            <div>
              <h2>Leaderboard</h2>
              <p className="card-subtitle">This month's top performers</p>
            </div>
          </div>
          <div className="card-content">
            {leaderboard?.length > 0 ? (
              <div className="leaderboard-list">
                {leaderboard.slice(0, 5).map((entry, i) => (
                  <div key={entry.userId} className="leaderboard-item">
                    <span className="rank">#{i + 1}</span>
                    <span className="username">
                      {entry.username}
                      {entry.userId === user?.id && <span className="you-indicator"> (You)</span>}
                    </span>
                    <span className="problems">
                      <span className="problems-count">{entry.monthlyProblemsSolved}</span> solved
                    </span>
                  </div>
                ))}
                <Link to="/leaderboard" className="btn-secondary">
                  View Full Leaderboard
                </Link>
              </div>
            ) : (
              <p className="loading-text">Loading leaderboard...</p>
            )}
          </div>
        </section>

        <section className="dashboard-card achievements">
          <div className="card-header">
            <FaBullseye className="card-icon" />
            <div>
              <h2>Recent Achievements</h2>
              <p className="card-subtitle">Your latest milestones</p>
            </div>
          </div>
          <div className="card-content">
            <div className="achievement-item">
              <div className="achievement-icon">🏆</div>
              <div className="achievement-details">
                <h3>Problem Solver</h3>
                <p>Solved {progress.completedProblems.length} problems</p>
              </div>
            </div>
            <div className="achievement-item">
              <div className="achievement-icon">🔥</div>
              <div className="achievement-details">
                <h3>Streak Builder</h3>
                <p>{progress.streak} day streak</p>
              </div>
            </div>
            <Link to="/achievements" className="btn-secondary">
              View All Achievements
            </Link>
          </div>
        </section>

        <section className="dashboard-card math-insight">
          <div className="card-header">
            <FaBook className="card-icon" />
            <div>
              <h2>Math Insight</h2>
              <p className="card-subtitle">Why mathematics matters</p>
            </div>
          </div>
          <div className="card-content">
            <div className="math-text-block">
              <h3>The Power of Math</h3>
              <p>
                Mathematics is the universal language of patterns, logic, and problem-solving that powers 
                everything from technology to scientific discovery.
              </p>
            </div>
            <Link to="/learn-more" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </section>

        <section className="dashboard-card quick-actions">
          <div className="card-header">
            <FaTasks className="card-icon" />
            <div>
              <h2>Quick Actions</h2>
              <p className="card-subtitle">Jump back into learning</p>
            </div>
          </div>
          <div className="card-content">
            <Link to="/problems" className="action-btn">
              Practice Problems
            </Link>
            <Link to="/challenges" className="action-btn">
              Weekly Challenges
            </Link>
            <Link to="/learn" className="action-btn">
              Learning Resources
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaChartLine } from 'react-icons/fa';
import '../Css/DetailedProgress.css';

const DetailedProgress = ({ user }) => {
  const [progress, setProgress] = useState({
    completedProblems: [],
    totalProblems: 1000,
    points: 0,
    streak: 0,
    rank: 'Beginner',
  });

  useEffect(() => {
    fetch('https://mathiq-eqcaybr35-proclan217s-projects.vercel.app/api/progress', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch progress');
        return res.json();
      })
      .then(data => setProgress({
        ...data,
        totalProblems: 1000,
        streak: data.streak || 0,
        rank: data.rank || 'Beginner'
      }))
      .catch(err => console.error(err.message));
  }, [user]);

  const completedSet = new Set(progress.completedProblems.map(p => p.id));

  const problems = Array.from({ length: progress.totalProblems }, (_, i) => {
    const id = i + 1;
    const isSolved = completedSet.has(id);
    return {
      id,
      title: `Problem ${id}`,
      solved: isSolved,
      points: isSolved ? (id % 3 === 0 ? 3 : id % 2 === 0 ? 2 : 1) : 0,
    };
  });

  // Calculate total points from solved problems
  const totalPoints = problems.reduce((sum, p) => sum + (p.solved ? p.points : 0), 0);

  // Group problems by hundreds for better display
  const problemGroups = [];
  for (let i = 0; i < problems.length; i += 100) {
    problemGroups.push(problems.slice(i, i + 100));
  }

  return (
    <div className="detailed-progress">
      <header className="progress-header">
        <h1>{user?.username || 'Guest'}'s Progress Dashboard</h1>
        <p className="subtitle">Track your learning journey and achievements</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card points">
          <div className="stat-icon">
            <FaTrophy />
          </div>
          <div className="stat-content">
            <h3>Total Points</h3>
            <p className="stat-value">{totalPoints}</p>
          </div>
        </div>

        <div className="stat-card solved">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>Problems Solved</h3>
            <p className="stat-value">
              {progress.completedProblems.length} <span>/ {progress.totalProblems}</span>
            </p>
          </div>
        </div>

        <div className="stat-card streak">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Current Streak</h3>
            <p className="stat-value">{progress.streak} days</p>
          </div>
        </div>

        <div className="stat-card rank">
          <div className="stat-icon">
            <FaTrophy />
          </div>
          <div className="stat-content">
            <h3>Your Rank</h3>
            <p className="stat-value">{progress.rank}</p>
          </div>
        </div>
      </div>

      <section className="progress-section">
        <h2 className="section-title">
          <FaChartLine className="section-icon" />
          Overall Progress
        </h2>
        <div className="progress-summary">
          <div className="progress-info">
            <span className="progress-text">
              {Math.round((progress.completedProblems.length / progress.totalProblems) * 100)}% Complete
            </span>
            <span className="progress-count">
              {progress.completedProblems.length} / {progress.totalProblems} problems
            </span>
          </div>
          <progress
            className="progress-bar"
            value={progress.completedProblems.length}
            max={progress.totalProblems}
          ></progress>
        </div>
      </section>

          </div>
  );
};

export default DetailedProgress;
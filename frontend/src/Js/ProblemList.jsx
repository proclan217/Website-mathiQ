import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import MathInput from '../components/MathInput';
import 'katex/dist/katex.min.css';
import { simplify, parse, evaluate } from 'mathjs';
import TeX from '@matejmazur/react-katex';
import '../Css/ProblemList.css';

const API_BASE_URL = 'https://mathiq-eqcaybr35-proclan217s-projects.vercel.app';

function ProblemList({ user, theme, setTheme }) {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [points, setPoints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [savingPoints, setSavingPoints] = useState(false);
  const [dailyChallenge, setDailyChallenge] = useState(null);

  // Helper to render math blocks/inline inside a string
  const renderWithMath = (content) => {
    if (!content) return null;
    const parts = content.split(/(\$\$.*?\$\$|\$.*?\$)/g);
    return parts.map((part, i) => {
      if (!part) return null;
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        return <TeX key={i} block math={math} />;
      } else if (part.startsWith('$') && part.endsWith('$')) {
        const math = part.slice(1, -1).trim();
        return <TeX key={i} math={math} />;
      }
      return <span key={i}>{part}</span>;
    });
  };

  // Fetch problems, daily challenge and user prefs on mount or theme change
  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const token = localStorage.getItem('token');
        const headers = token
          ? {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          : { 'Content-Type': 'application/json' };

        // Fetch problems and daily challenge in parallel
        const [problemsRes, dailyRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/problems`, { headers, cancelToken: cancelTokenSource.token }),
          axios.get(`${API_BASE_URL}/api/dailychallenges`, { headers, cancelToken: cancelTokenSource.token }),
        ]);

        setProblems(problemsRes.data);
        if (dailyRes.data?._id) setDailyChallenge(dailyRes.data);

        // Fetch user preferences if logged in
        if (token) {
          try {
          } catch (err) {
            if (!axios.isCancel(err)) {
              console.error('Error fetching preferences:', err);
            }
          }
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          setFetchError(err.response?.data?.message || 'Failed to fetch data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => cancelTokenSource.cancel('Component unmounted');
  }, [setTheme]);

  // Save points and theme preference to backend when they change
// Save points to backend when they change
useEffect(() => {
  if (!user) return;

  const timer = setTimeout(async () => {
    setSavingPoints(true);
    setSaveError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(
        `${API_BASE_URL}/api/progress`,
        { points },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err) {
      console.error('Failed to save progress:', err);
      setSaveError('⚠️ Failed to save points. Please check your connection.');
    } finally {
      setSavingPoints(false);
    }
  }, 1000);

  return () => clearTimeout(timer);
}, [points, user]);


  // Compares user answer and correct answer mathematically
  const compareMathExpressions = async (userAnswer, correctAnswer) => {
    try {
      if (!userAnswer || !correctAnswer) return false;

      if (userAnswer === correctAnswer) return true;

      const userExpr = simplify(parse(userAnswer));
      const correctExpr = simplify(parse(correctAnswer));

      if (userExpr.toString() === correctExpr.toString()) return true;

      const testValues = [
        { x: 1, y: 1, z: 1 },
        { x: 2, y: 3, z: 1 },
        { x: -1, y: 5, z: 2 },
        { x: 0.5, y: 0.25, z: 0.1 },
      ];

      return testValues.every((values) => {
        const userVal = evaluate(userExpr, values);
        const correctVal = evaluate(correctExpr, values);
        return Math.abs(userVal - correctVal) < 0.0001;
      });
    } catch (e) {
      console.error('Comparison error:', e);
      return false;
    }
  };

  // Points by difficulty
  const calculatePoints = (difficulty) => {
    const diff = difficulty?.toLowerCase();
    switch (diff) {
      case 'easy':
        return 1;
      case 'medium':
        return 3;
      case 'hard':
        return 5;
      default:
        return 0;
    }
  };

  // Update user progress backend API
  async function updateBackendProgress(problemId, token) {
    try {
      if (!problemId) {
        console.error('No problemId provided to updateBackendProgress');
        throw new Error('Invalid progress data');
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/progress`,
        { problemId },
        { 
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          } 
        }
      );

      console.log('Progress saved successfully:', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Failed to save progress. Status:', error.response.status, 'Data:', error.response.data);
        alert('✅ Correct answer, but failed to save progress. Please try again later.');
      } else if (error.request) {
        console.error('No response from server:', error.request);
        alert('Network error: Unable to reach server.');
      } else {
        console.error('Error setting up request:', error.message);
        alert('Unexpected error: ' + error.message);
      }
    }
  }

  // Check user answer and update state/backend
  const checkAnswer = useCallback(async () => {
    if (!selectedProblem) return;

    if (userAnswer.trim() === '') {
      setFeedback('❌ Please enter an answer before submitting.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setFeedback('❌ Please log in to submit answers.');
        return;
      }

      const isCorrect = await compareMathExpressions(userAnswer.trim(), selectedProblem.solution || '');

      if (isCorrect) {
        const bonus = calculatePoints(selectedProblem.difficulty);
        setPoints((prev) => prev + bonus);
        setFeedback(`✅ Correct! +${bonus} points`);

        try {
          // Ensure problemId is a string
          console.log('Sending problemId:', selectedProblem._id, typeof selectedProblem._id);
          await updateBackendProgress(String(selectedProblem._id), token);
        } catch (err) {
          console.error('Update error:', err);
          setFeedback('✅ Correct answer, but failed to save progress. Please try again later.');
        }
      } else {
        setFeedback('❌ Incorrect. Try again or check the solution.');
      }
    } catch (error) {
      console.error('Error checking answer:', error);
      setFeedback('❌ Error checking answer. Please try again.');
    }
  }, [selectedProblem, userAnswer, user]);

  // Filter problems by title search
  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="math-symbol">∞</div>
        <p>Loading problems...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="error-container">
        <div className="math-symbol">≠</div>
        <p>Error: {fetchError}</p>
        <button className="btn-extra" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`problem-list-page ${theme}-theme`}>
      <div className="problem-list-container">
        <div className="problem-list-header">
          <div className="title-container">
            <div className="math-symbol">∑</div>
            <h1 className="app-title">
              Math <span className="highlight">Problems</span>
            </h1>
          </div>

          <div className="header-controls">
            <div className="points-display">
              <span>🎯</span> {points} points{' '}
              {savingPoints && <span className="saving-indicator">Saving...</span>}
              {saveError && <span className="error-indicator">{saveError}</span>}
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        {dailyChallenge && (
          <div className="daily-challenge">
            <h2>🌞 Daily Challenge</h2>
            <div
              className="problem-card daily"
              onClick={() => {
                setSelectedProblem(dailyChallenge);
                setUserAnswer('');
                setFeedback('');
                setShowSolution(false);
              }}
            >
              {dailyChallenge.imageUrl && (
                <img
                  src={dailyChallenge.imageUrl}
                  alt={dailyChallenge.title}
                  className="problem-image"
                />
              )}
              <h3>
                {dailyChallenge.title}{' '}
                {typeof dailyChallenge.difficulty === 'string' && (
                  <span className={`difficulty ${dailyChallenge.difficulty.toLowerCase()}`}>
                    ({dailyChallenge.difficulty})
                  </span>
                )}
              </h3>
              <div className="problem-description">
                <TeX block math={dailyChallenge.description} />
              </div>
            </div>
          </div>
        )}

        <div className="search-container">
          <input
            type="text"
            placeholder="Search problems by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {filteredProblems.length === 0 ? (
          <div className="no-results">
            <div className="math-symbol">∅</div>
            <p>No math problems found.</p>
          </div>
        ) : (
          <div className="problems-grid">
            {filteredProblems.map((p) => (
              <div
                key={p._id}
                className="problem-card"
                onClick={() => {
                  setSelectedProblem(p);
                  setUserAnswer('');
                  setFeedback('');
                  setShowSolution(false);
                }}
              >
                {p.imageUrl && (
                  <img src={p.imageUrl} alt={p.title} className="problem-image" />
                )}
                <h3>
                  {p.title}{' '}
                  {typeof p.difficulty === 'string' && (
                    <span className={`difficulty ${p.difficulty.toLowerCase()}`}>
                      ({p.difficulty})
                    </span>
                  )}
                </h3>
                <div className="problem-description">
                  <TeX block math={p.description} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProblem && (
        <div className="modal-overlay" onClick={() => setSelectedProblem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProblem.title}</h2>
              <span className="difficulty-badge">{selectedProblem.difficulty}</span>
            </div>

            {selectedProblem.imageUrl && (
              <img
                src={selectedProblem.imageUrl}
                alt={selectedProblem.title}
                className="modal-image"
              />
            )}

            <div className="problem-content">
              <TeX block math={selectedProblem.description} />
            </div>

            {!showSolution ? (
              <>
                <MathInput value={userAnswer} onChange={setUserAnswer} />

                {feedback && (
                  <div className={`feedback ${feedback.startsWith('✅') ? 'success' : 'error'}`}>
                    {feedback}
                  </div>
                )}

                <div className="modal-actions">
                  <button className="btn-extra check-answer-btn" onClick={checkAnswer}>
                    Submit Answer
                  </button>
                  <button
                    className="btn-secondary show-solution-btn"
                    onClick={() => setShowSolution(true)}
                  >
                    Show Solution
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="solution-container">
                  <h3>Solution</h3>
                  <div className="solution-content">
                    {renderWithMath(selectedProblem.solution || 'No solution provided.')}
                  </div>

                  {selectedProblem.answer && (
                    <>
                      <h3>Final Answer</h3>
                      <div className="final-answer">
                        {renderWithMath(selectedProblem.answer)}
                      </div>
                    </>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    className="btn-extra back-to-problem-btn"
                    onClick={() => setShowSolution(false)}
                  >
                    Back to Problem
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemList;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Css/ProblemList.css';

function ProblemList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [points, setPoints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProblems() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('http://localhost:5000/api/problems', { headers });
        setProblems(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch problems.');
      } finally {
        setLoading(false);
      }
    }

    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const normalize = (str) => {
    return str
      ?.toLowerCase()
      .replace(/[^0-9a-z.\-+/=]/gi, '')
      .replace(/^x=/, '')
      .trim();
  };

  const tryEvaluate = (input) => {
    try {
      // eslint-disable-next-line no-new-func
      return Function('"use strict";return (' + input + ')')();
    } catch {
      return null;
    }
  };

  const checkAnswer = () => {
    if (!selectedProblem) return;

    if (userAnswer.trim() === '') {
      setFeedback('❌ Please enter an answer before submitting.');
      return;
    }

    const correctRaw = selectedProblem.solution || '';
    const correctAnswer = correctRaw.trim().toLowerCase();
    const user = userAnswer.trim().toLowerCase();

    const extractNum = (str) => {
      const match = str?.match(/-?\d+(\.\d+)?/);
      return match ? parseFloat(match[0]) : null;
    };

    const correctNum = extractNum(correctAnswer);
    const userNum = extractNum(user);

    const normalizedCorrect = normalize(correctRaw);
    const normalizedUser = normalize(userAnswer);

    const correctVal = tryEvaluate(normalizedCorrect);
    const userVal = tryEvaluate(normalizedUser);

    const matchByNumber = correctNum !== null && userNum !== null && correctNum === userNum;
    const matchByString = normalizedCorrect === normalizedUser;
    const numericMatch = correctVal !== null && userVal !== null && Math.abs(correctVal - userVal) < 0.0001;

    if (matchByNumber || matchByString || numericMatch) {
      let bonus = 0;
      if (selectedProblem.difficulty.toLowerCase() === 'easy') bonus = 1;
      else if (selectedProblem.difficulty.toLowerCase() === 'medium') bonus = 3;
      else if (selectedProblem.difficulty.toLowerCase() === 'hard') bonus = 5;

      setPoints((prev) => prev + bonus);
      setFeedback(`✅ Correct! +${bonus} points`);
    } else {
      setFeedback('❌ Incorrect. Try again or check the solution.');
    }
  };

  if (loading) return (
    <div className="loading-container">
      <div className="math-symbol">∞</div>
      <p>Loading problems...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="math-symbol">≠</div>
      <p>Error: {error}</p>
      <button 
        className="btn-extra"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="problem-list-page">
      {/* Background animation would go here */}
      
      <div className="problem-list-container">
        <div className="problem-list-header">
          <div className="title-container">
            <div className="math-symbol">∑</div>
            <h1 className='app-title'>Math <span className="highlight">Problems</span></h1>
          </div>
          
          <div className="header-controls">
            <div className="points-display">
              <span>🎯</span> {points} points
            </div>
            
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </div>
        </div>

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
                  {p.title} <span className={`difficulty ${p.difficulty.toLowerCase()}`}>
                    ({p.difficulty})
                  </span>
                </h3>
                <div className="problem-description" dangerouslySetInnerHTML={{ __html: p.description }} />
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
              <span className="difficulty-badge">
                {selectedProblem.difficulty}
              </span>
            </div>

            {selectedProblem.imageUrl && (
              <img
                src={selectedProblem.imageUrl}
                alt={selectedProblem.title}
                className="modal-image"
              />
            )}

            <div className="problem-content" dangerouslySetInnerHTML={{ __html: selectedProblem.description }} />

            {!showSolution ? (
              <>
                <textarea
                  className="answer-input"
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={3}
                />
                
                {feedback && (
                  <div className={`feedback ${feedback.startsWith('✅') ? 'success' : 'error'}`}>
                    {feedback}
                  </div>
                )}

                <div className="modal-actions">
                  <button 
                    className="btn-extra check-answer-btn"
                    onClick={checkAnswer}
                  >
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
                    {selectedProblem.solution || 'No solution provided.'}
                  </div>
                  
                  {selectedProblem.answer && (
                    <>
                      <h3>Final Answer</h3>
                      <div className="final-answer">
                        {selectedProblem.answer}
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
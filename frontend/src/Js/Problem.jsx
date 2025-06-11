import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Problem() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solutionContent, setSolutionContent] = useState('');
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    async function fetchProblem() {
      setLoading(true);
      try {
        const response = await axios.get(`https://by-taha-website-mathiq.vercel.app/api/problems/${id}solutions`);
        setProblem(response.data);
      } catch (err) {
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [id]);

  async function handleSubmitSolution(e) {
    e.preventDefault();
    setSubmitError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://by-taha-website-mathiq.vercel.app/api/problems/${id}`,
        { content: solutionContent },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      // Append the new solution to the list
      setProblem(prev => ({
        ...prev,
        solutions: [...prev.solutions, response.data]
      }));
      setSolutionContent('');
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit solution.');
    }
  }

  if (loading) return <p>Loading problem...</p>;
  if (!problem) return <p>Problem not found.</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{problem.title}</h2>
      <p><strong>Category:</strong> {problem.category}</p>
      <p><strong>Difficulty:</strong> {problem.difficulty}</p>
      <div dangerouslySetInnerHTML={{ __html: problem.description }} style={{ marginBottom: '1rem' }} />

      <hr />

      <h3>Solution</h3>
        {!problem.solution ? (
          <p>No solution yet.</p>
        ) : (
          <div style={{ backgroundColor: '#f9f9f9', padding: '0.5rem', borderRadius: '5px', marginBottom: '1rem' }}>
            <p>{problem.solution}</p>
          </div>
        )}

      <hr />

      <h3>Submit a Solution</h3>
      <form onSubmit={handleSubmitSolution}>
        <textarea
          value={solutionContent}
          onChange={(e) => setSolutionContent(e.target.value)}
          rows={5}
          style={{ width: '100%', marginBottom: '0.5rem' }}
          placeholder="Write your solution here..."
          required
        />
        {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
        <button type="submit">Submit Solution</button>
      </form>
    </div>
  );
}

export default Problem;

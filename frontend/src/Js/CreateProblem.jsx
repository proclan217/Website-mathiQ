import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import '../Css/CreateProblem.css';
import MathInput from '../components/MathInput';

const CreateProblem = () => {
  const [activeTab, setActiveTab] = useState('problem');

  const [problemData, setProblemData] = useState({
    title: '',
    category: 'algebra',
    difficulty: 'easy',
    description: '',
    imageUrl: '',
    solution: ''
  });

  const [dailyChallengeData, setDailyChallengeData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    difficulty: 'easy',
    description: '',
    imageUrl: '',
    solution: '',
    category: 'algebra'
  });

  const [message, setMessage] = useState({ text: '', variant: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, type = 'problem') => {
    const { name, value } = e.target;
    if (type === 'problem') {
      setProblemData(prev => ({ ...prev, [name]: value }));
    } else {
      setDailyChallengeData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e, type = 'problem') => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', variant: '' });

    const formData = type === 'problem' ? problemData : dailyChallengeData;
    const endpoint = type === 'problem' ? 'problems' : 'dailychallenges';

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `https://by-taha-website-mathiq.vercel.app/api/${endpoint}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      setMessage({
        text: `${type === 'problem' ? 'Problem' : 'Daily Challenge'} created successfully!`,
        variant: 'success'
      });

      if (type === 'problem') {
        setProblemData({
          title: '',
          category: 'algebra',
          difficulty: 'easy',
          description: '',
          imageUrl: '',
          solution: ''
        });
      } else {
        setDailyChallengeData({
          title: '',
          date: new Date().toISOString().split('T')[0],
          difficulty: 'easy',
          description: '',
          imageUrl: '',
          solution: '',
          category: 'algebra'
        });
      }

      setTimeout(() => {
        navigate(
          type === 'problem'
            ? `/problems/${response.data._id}`
            : `/dailychallenges/${response.data._id || response.data.challenge._id}`
        );
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setMessage({
        text: error.response?.data?.message || error.message || 'Network error',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="problem-list-page">
      <div className="problem-list-container">
        <Card className="create-problem-card">
          <h2>Create New Math Problem</h2>

          <div className="tab-buttons mb-3">
            <Button
              variant={activeTab === 'problem' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('problem')}
              className="me-2"
            >
              Problem
            </Button>
            <Button
              variant={activeTab === 'dailyChallenge' ? 'primary' : 'secondary'}
              onClick={() => setActiveTab('dailyChallenge')}
            >
              Daily Challenge
            </Button>
          </div>

          {message.text && (
            <Alert variant={message.variant}>{message.text}</Alert>
          )}

          {activeTab === 'problem' && (
            <Form onSubmit={(e) => handleSubmit(e, 'problem')}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={problemData.title}
                  onChange={(e) => handleChange(e, 'problem')}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <MathInput
                  value={problemData.description}
                  onChange={(value) => setProblemData(prev => ({ ...prev, description: value }))}
                  rows={5}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={problemData.category}
                  onChange={(e) => handleChange(e, 'problem')}
                  required
                >
                  <option value="algebra">Algebra</option>
                  <option value="geometry">Geometry</option>
                  <option value="calculus">Calculus</option>
                  <option value="trigonometry">Trigonometry</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  name="difficulty"
                  value={problemData.difficulty}
                  onChange={(e) => handleChange(e, 'problem')}
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URL (optional)</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={problemData.imageUrl}
                  onChange={(e) => handleChange(e, 'problem')}
                  placeholder="https://example.com/image.png"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Solution</Form.Label>
                <MathInput
                  value={problemData.solution}
                  onChange={(value) => setProblemData(prev => ({ ...prev, solution: value }))}
                  rows={4}
                />
              </Form.Group>

              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Problem'}
              </Button>
            </Form>
          )}

          {activeTab === 'dailyChallenge' && (
            <Form onSubmit={(e) => handleSubmit(e, 'dailyChallenge')}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={dailyChallengeData.title}
                  onChange={(e) => handleChange(e, 'dailyChallenge')}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={dailyChallengeData.date}
                  onChange={(e) => handleChange(e, 'dailyChallenge')}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  name="difficulty"
                  value={dailyChallengeData.difficulty}
                  onChange={(e) => handleChange(e, 'dailyChallenge')}
                  required
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <MathInput
                  value={dailyChallengeData.description}
                  onChange={(value) => setDailyChallengeData(prev => ({ ...prev, description: value }))}
                  rows={5}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image URL (optional)</Form.Label>
                <Form.Control
                  type="url"
                  name="imageUrl"
                  value={dailyChallengeData.imageUrl}
                  onChange={(e) => handleChange(e, 'dailyChallenge')}
                  placeholder="https://example.com/image.png"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Solution</Form.Label>
                <MathInput
                  value={dailyChallengeData.solution}
                  onChange={(value) => setDailyChallengeData(prev => ({ ...prev, solution: value }))}
                  rows={4}
                />
              </Form.Group>

              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Daily Challenge'}
              </Button>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreateProblem;

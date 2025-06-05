import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import '../Css/CreateProblem.css';

const CreateProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'algebra',
    difficulty: 'easy',
    description: '',
    imageUrl: '',
    solution: ''
  });

  const [message, setMessage] = useState({ text: '', variant: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post('http://localhost:5000/api/problems', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      setMessage({ text: 'Problem created successfully!', variant: 'success' });
      setFormData({
        title: '',
        category: 'algebra',
        difficulty: 'easy',
        description: '',
        imageUrl: '',
        solution: ''
      });

      setTimeout(() => {
        navigate(`/problems/${response.data._id}`);
      }, 2000);
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || error.message || 'Network error - check console',
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
          {message.text && (
            <Alert variant={message.variant} onClose={() => setMessage({ text: '', variant: '' })} dismissible>
              {message.text}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="form-label">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="algebra">Algebra</option>
                <option value="geometry">Geometry</option>
                <option value="calculus">Calculus</option>
                <option value="trigonometry">Trigonometry</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Difficulty</Form.Label>
              <Form.Select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Image URL (optional)</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.png"
                className="form-control"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Solution</Form.Label>
              <Form.Control
                as="textarea"
                name="solution"
                rows={4}
                value={formData.solution}
                onChange={handleChange}
                required
                className="form-control"
              />
            </Form.Group>

            <Button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? 'Creating...' : 'Create Problem'}
            </Button>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default CreateProblem;
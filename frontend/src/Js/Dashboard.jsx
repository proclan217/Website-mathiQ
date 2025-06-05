import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const Problem = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [solution, setSolution] = useState('');
  const [solutions, setSolutions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`/api/problems/${id}`);
        setProblem(response.data.problem);
        setSolutions(response.data.solutions);
      } catch (err) {
        setError('Failed to fetch problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/problems/${id}/solutions`, {
        content: solution
      });
      setSolutions([...solutions, response.data.solution]);
      setSolution('');
    } catch (err) {
      setError('Failed to submit solution');
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <Button variant="outline-primary" onClick={() => navigate(-1)} className="mb-3">
        Back to Problems
      </Button>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>{problem.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {problem.category} • {problem.difficulty}
          </Card.Subtitle>
          <Card.Text>{problem.description}</Card.Text>
        </Card.Body>
      </Card>

      <Row>
        <Col md={6}>
          <h4>Submit Your Solution</h4>
          <Form onSubmit={handleSubmitSolution}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={5}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="Explain your solution here..."
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Solution
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <h4>Existing Solutions ({solutions.length})</h4>
          {solutions.length > 0 ? (
            solutions((sol) => (
              <Card key={sol._id} className="mb-3">
                <Card.Body>
                  <Card.Text>{sol.content}</Card.Text>
                  <Card.Footer className="text-muted">
                    Posted by {sol.author.name}
                  </Card.Footer>
                </Card.Body>
              </Card>
            ))
          ) : (
            <Alert variant="info">No solutions yet. Be the first to solve!</Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Problem;
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listQuizzes } from '../api/quizzes';
import useAuthStore from '../store/authStore';
import './Quiz.css';

const QuizList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, [skip]);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listQuizzes({ skip, limit });
      setQuizzes(data);
      setHasMore(data.length === limit);
    } catch (err) {
      setError(err.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setSkip(prev => prev + limit);
  };

  const handlePrevious = () => {
    setSkip(prev => Math.max(0, prev - limit));
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  if (loading && quizzes.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <h1>Quizzes</h1>
          <Link to="/quizzes/new" className="btn btn-primary">
            Create Quiz
          </Link>
        </div>
        <div className="loading">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Quizzes</h1>
        <Link to="/quizzes/new" className="btn btn-primary">
          Create Quiz
        </Link>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {quizzes.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No quizzes found.</p>
          <Link to="/quizzes/new" className="btn btn-primary">
            Create Your First Quiz
          </Link>
        </div>
      ) : (
        <>
          <div className="quiz-grid">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-card" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
                <div className="quiz-card-header">
                  <h2 className="quiz-card-title">{quiz.title}</h2>
                  <span className={`badge ${quiz.is_public ? 'badge-public' : 'badge-private'}`}>
                    {quiz.is_public ? 'Public' : 'Private'}
                  </span>
                </div>
                {quiz.description && (
                  <p className="quiz-card-description">{quiz.description}</p>
                )}
                <div className="quiz-card-footer">
                  <span className="quiz-card-meta">
                    Created: {formatDate(quiz.created_at)}
                  </span>
                  {quiz.author_id === user?.id && (
                    <span className="quiz-card-author">Your quiz</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={skip === 0 || loading}
            >
              Previous
            </button>
            <span className="pagination-info">
              Showing {skip + 1}-{skip + quizzes.length}
            </span>
            <button
              className="btn btn-secondary"
              onClick={handleNext}
              disabled={!hasMore || loading}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizList;

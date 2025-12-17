import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createQuestion } from '../api/questions';
import { getQuiz } from '../api/quizzes';
import useAuthStore from '../store/authStore';
import QuestionForm from '../components/quiz/QuestionForm';
import './Quiz.css';

const QuestionCreate = () => {
  const { id } = useParams();
  const quizId = id;
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questionsCount, setQuestionsCount] = useState(0);

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuiz(quizId);
      setQuiz(data);
      setQuestionsCount(0);
    } catch (err) {
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (questionData) => {
    if (!user) {
      setError('You must be logged in to create a question');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await createQuestion(quizId, questionData);
      navigate(`/quizzes/${quizId}`, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.detail 
        ? (Array.isArray(err.response.data.detail) 
            ? err.response.data.detail.map(e => e.msg).join(', ')
            : err.response.data.detail)
        : err.message || 'Failed to create question';
      setError(errorMessage);
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/quizzes/${quizId}`);
  };

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="quiz-container">
        <div className="error-message" role="alert">
          {error}
        </div>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Back to Quiz
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-container">
        <div className="error-message">Quiz not found</div>
        <button className="btn btn-secondary" onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (user && quiz.author_id !== user.id) {
    return (
      <div className="quiz-container">
        <div className="error-message">You do not have permission to add questions to this quiz</div>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Back to Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-form-container">
        <h1>Add Question to: {quiz.title}</h1>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        <QuestionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          quizId={quizId}
          existingQuestionsCount={questionsCount}
        />
      </div>
    </div>
  );
};

export default QuestionCreate;


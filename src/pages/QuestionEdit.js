import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateQuestion, deleteQuestion, getQuestion } from '../api/questions';
import { getQuiz } from '../api/quizzes';
import useAuthStore from '../store/authStore';
import QuestionForm from '../components/quiz/QuestionForm';
import './Quiz.css';

const QuestionEdit = () => {
  const { id: quizId, questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    loadData();
  }, [quizId, questionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [quizData, questionData] = await Promise.all([
        getQuiz(quizId),
        getQuestion(questionId),
      ]);
      
      setQuiz(quizData);
      setQuestion(questionData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (questionData) => {
    try {
      setSaving(true);
      setError(null);
      await updateQuestion(questionId, questionData);
      navigate(`/quizzes/${quizId}`, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.detail 
        ? (Array.isArray(err.response.data.detail) 
            ? err.response.data.detail.map(e => e.msg).join(', ')
            : err.response.data.detail)
        : err.message || 'Failed to update question';
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

  // Check if user is author
  if (user && quiz.author_id !== user.id) {
    return (
      <div className="quiz-container">
        <div className="error-message">You do not have permission to edit questions in this quiz</div>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Back to Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-form-container">
        <h1>Edit Question</h1>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
        {question ? (
          <QuestionForm
            question={question}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            quizId={quizId}
          />
        ) : (
          <div className="error-message">
            Question not found. Please note: Question editing requires fetching the question data separately.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEdit;


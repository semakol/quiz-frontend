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
      setError(err.message || 'Ошибка при загрузке викторины');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (questionData) => {
    if (!user) {
      setError('Вы должны войти в систему, чтобы добавить вопрос');
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
        : err.message || 'Ошибка при создании вопроса';
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
        <div className="loading">Загрузка...</div>
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
          Вернуться к викторине
        </button>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-container">
        <div className="error-message">Викторина не найдена</div>
        <button className="btn btn-secondary" onClick={() => navigate('/quizzes')}>
          Вернуться к викторинам
        </button>
      </div>
    );
  }

  if (user && quiz.author_id !== user.id) {
    return (
      <div className="quiz-container">
        <div className="error-message">Вы не имеете прав на добавление вопросов к этой викторине</div>
        <button className="btn btn-secondary" onClick={handleCancel}>
          Вернуться к викторине
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-form-container">
        <h1>Добавление: {quiz.title}</h1>
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


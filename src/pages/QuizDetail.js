import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuiz, deleteQuiz } from '../api/quizzes';
import { deleteQuestion, getQuestionsByQuiz } from '../api/questions';
import useAuthStore from '../store/authStore';
import QuestionList from '../components/quiz/QuestionList';
import './Quiz.css';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuiz(id);
      setQuiz(data);
      
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        try {
          const questionsData = await getQuestionsByQuiz(id);
          setQuestions(Array.isArray(questionsData) ? questionsData : []);
        } catch (questionsErr) {
          console.warn('Could not fetch questions separately:', questionsErr);
          setQuestions([]);
        }
      }
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке викторины');
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = (question) => {
    navigate(`/quizzes/${id}/questions/${question.id}/edit`);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот вопрос? Это действие необратимо.')) {
      return;
    }

    try {
      await deleteQuestion(questionId);
      loadQuiz();
    } catch (err) {
      setError(err.message || 'Ошибка при удалении вопроса');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить эту викторину? Это действие необратимо.')) {
      return;
    }

    try {
      setDeleting(true);
      await deleteQuiz(id);
      navigate('/quizzes', { replace: true });
    } catch (err) {
      setError(err.message || 'Ошибка при удалении викторины');
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const isAuthor = user && quiz && user.id === quiz.author_id;

  if (loading) {
    return (
      <div className="quiz-container">
        <div className="loading">Загрузка викторины...</div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="quiz-container">
        <div className="error-message" role="alert">
          {error}
        </div>
        <Link to="/quizzes" className="btn btn-secondary">
          Вернуться к викторинам
        </Link>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="quiz-container">
        <div className="error-message">Викторина не найдена</div>
        <Link to="/quizzes" className="btn btn-secondary">
          Вернуться к викторинам
        </Link>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-detail-header">
        <div>
          <Link to="/quizzes" className="btn btn-link">
            ← Вернуться к викторинам
          </Link>
          <h1 className="quiz-detail-title">{quiz.title}</h1>
          <div className="quiz-detail-meta">
            <span className={`badge ${quiz.is_public ? 'badge-public' : 'badge-private'}`}>
              {quiz.is_public ? 'Публичная' : 'Приватная'}
            </span>
            <span className="quiz-meta-item">
              Создана: {formatDate(quiz.created_at)}
            </span>
            {isAuthor && (
              <span className="quiz-meta-item">Автор: Вы</span>
            )}
          </div>
        </div>
        {isAuthor && (
          <div className="quiz-detail-actions">
            <Link to={`/quizzes/${id}/edit`} className="btn btn-secondary">
              Редактировать викторину
            </Link>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Удаление...' : 'Удалить'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {quiz.description && (
        <div className="quiz-detail-description">
          <h2>Описание</h2>
          <p>{quiz.description}</p>
        </div>
      )}

      <div className="quiz-detail-section">
        <div className="quiz-detail-section-header">
          <h2>Вопросы</h2>
          {isAuthor && (
            <Link to={`/quizzes/${id}/questions/new`} className="btn btn-primary">
              + Добавить вопрос
            </Link>
          )}
        </div>
        <QuestionList
          questions={questions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
          isAuthor={isAuthor}
        />
      </div>

      <div className="quiz-detail-actions-bottom">
        <Link to={`/sessions/create?quiz=${id}`} className="btn btn-primary">
          Начать сессию
        </Link>
      </div>
    </div>
  );
};

export default QuizDetail;

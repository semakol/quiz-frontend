import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz, updateQuiz } from '../api/quizzes';
import useAuthStore from '../store/authStore';
import { quizSchema } from '../utils/validation';
import './Quiz.css';

const QuizEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(quizSchema),
  });

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuiz(id);
      
      if (user && data.author_id !== user.id) {
        setError('Вы не авторизованы для редактирования этой викторины');
        return;
      }

      setQuiz(data);
      reset({
        title: data.title,
        description: data.description || '',
        is_public: data.is_public,
      });
    } catch (err) {
      setError(err.message || 'Ошибка при загрузке викторины');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setError(null);
      await updateQuiz(id, {
        title: data.title,
        description: data.description || null,
        is_public: data.is_public || false,
      });
      navigate(`/quizzes/${id}`, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.detail 
        ? (Array.isArray(err.response.data.detail) 
            ? err.response.data.detail.map(e => e.msg).join(', ')
            : err.response.data.detail)
        : err.message || 'Ошибка при обновлении викторины';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

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
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/quizzes')}
        >
          Вернуться к викторинам
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-form-container">
        <h1>Редактирование викторины</h1>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="quiz-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Название <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={`form-input ${errors.title ? 'form-input-error' : ''}`}
              placeholder="Enter quiz title"
              disabled={saving}
            />
            {errors.title && (
              <span className="error-text">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Описание
            </label>
            <textarea
              id="description"
              {...register('description')}
              className={`form-input form-textarea ${errors.description ? 'form-input-error' : ''}`}
              placeholder="Enter quiz description (optional)"
              rows="4"
              disabled={saving}
            />
            {errors.description && (
              <span className="error-text">{errors.description.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                {...register('is_public')}
                className="form-checkbox"
                disabled={saving}
              />
              <span>Сделать эту викторину публичной</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/quizzes/${id}`)}
              disabled={saving}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizEdit;

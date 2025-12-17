import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../api/quizzes';
import useAuthStore from '../store/authStore';
import { quizSchema } from '../utils/validation';
import './Quiz.css';

const QuizCreate = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(quizSchema),
    defaultValues: {
      is_public: false,
    },
  });

  const onSubmit = async (data) => {
    if (!user) {
      setError('You must be logged in to create a quiz');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newQuiz = await createQuiz({
        title: data.title,
        description: data.description || null,
        author_id: user.id,
        is_public: data.is_public || false,
      });
      navigate(`/quizzes/${newQuiz.id}`, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.detail 
        ? (Array.isArray(err.response.data.detail) 
            ? err.response.data.detail.map(e => e.msg).join(', ')
            : err.response.data.detail)
        : err.message || 'Failed to create quiz';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-form-container">
        <h1>Create New Quiz</h1>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="quiz-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className={`form-input ${errors.title ? 'form-input-error' : ''}`}
              placeholder="Enter quiz title"
              disabled={loading}
            />
            {errors.title && (
              <span className="error-text">{errors.title.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              {...register('description')}
              className={`form-input form-textarea ${errors.description ? 'form-input-error' : ''}`}
              placeholder="Enter quiz description (optional)"
              rows="4"
              disabled={loading}
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
                disabled={loading}
              />
              <span>Make this quiz public</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/quizzes')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizCreate;

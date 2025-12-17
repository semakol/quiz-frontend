import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createSession } from '../api/sessions';
import { getQuiz } from '../api/quizzes';
import { listQuizzes } from '../api/quizzes';
import useAuthStore from '../store/authStore';
import { sessionSchema } from '../utils/validation';
import './Quiz.css';

const SessionCreate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [sessionUrl, setSessionUrl] = useState('');

  const quizIdFromUrl = searchParams.get('quiz');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(sessionSchema),
    defaultValues: {
      quiz_id: quizIdFromUrl ? parseInt(quizIdFromUrl) : undefined,
      host_id: user?.id,
      url: '',
      status: 'pending',
    },
  });

  const watchedQuizId = watch('quiz_id');

  useEffect(() => {
    loadQuizzes();
    if (quizIdFromUrl) {
      loadQuiz(parseInt(quizIdFromUrl));
      setValue('quiz_id', parseInt(quizIdFromUrl));
    }
    generateSessionUrl();
  }, [quizIdFromUrl]);

  useEffect(() => {
    if (watchedQuizId) {
      loadQuiz(watchedQuizId);
    }
  }, [watchedQuizId]);

  const loadQuizzes = async () => {
    try {
      const data = await listQuizzes({ limit: 100 });
      setQuizzes(data);
    } catch (err) {
      console.error('Failed to load quizzes:', err);
    }
  };

  const loadQuiz = async (quizId) => {
    try {
      const quiz = await getQuiz(quizId);
      setSelectedQuiz(quiz);
    } catch (err) {
      console.error('Failed to load quiz:', err);
    }
  };

  const generateSessionUrl = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const url = `/sessions/${timestamp}-${random}`;
    setSessionUrl(url);
    setValue('url', url);
  };

  const onSubmit = async (data) => {
    if (!user) {
      setError('You must be logged in to create a session');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const session = await createSession({
        quiz_id: data.quiz_id,
        host_id: user.id,
        url: data.url,
        status: data.status,
      });
      
      navigate(data.url, { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.detail 
        ? (Array.isArray(err.response.data.detail) 
            ? err.response.data.detail.map(e => e.msg).join(', ')
            : err.response.data.detail)
        : err.message || 'Failed to create session';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-form-container">
        <h1>Create Quiz Session</h1>
        <p className="form-subtitle">Start a new quiz session for participants to join</p>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="quiz-form">
          <div className="form-group">
            <label htmlFor="quiz_id" className="form-label">
              Quiz <span className="required">*</span>
            </label>
            <select
              id="quiz_id"
              {...register('quiz_id', { valueAsNumber: true })}
              className={`form-input ${errors.quiz_id ? 'form-input-error' : ''}`}
              disabled={loading || !!quizIdFromUrl}
            >
              <option value="">Select a quiz</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title} {quiz.is_public ? '(Public)' : '(Private)'}
                </option>
              ))}
            </select>
            {errors.quiz_id && (
              <span className="error-text">{errors.quiz_id.message}</span>
            )}
            {selectedQuiz && (
              <div className="form-hint">
                Selected: {selectedQuiz.title}
                {selectedQuiz.description && ` - ${selectedQuiz.description}`}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="url" className="form-label">
              Session URL <span className="required">*</span>
            </label>
            <input
              id="url"
              type="text"
              {...register('url')}
              className={`form-input ${errors.url ? 'form-input-error' : ''}`}
              placeholder="Session URL"
              disabled={loading}
            />
            <button
              type="button"
              className="btn btn-small btn-secondary"
              onClick={generateSessionUrl}
              style={{ marginTop: '8px' }}
            >
              Generate URL
            </button>
            {errors.url && (
              <span className="error-text">{errors.url.message}</span>
            )}
            <small className="form-hint">
              This URL will be used by participants to join the session
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Initial Status <span className="required">*</span>
            </label>
            <select
              id="status"
              {...register('status')}
              className={`form-input ${errors.status ? 'form-input-error' : ''}`}
              disabled={loading}
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
            </select>
            {errors.status && (
              <span className="error-text">{errors.status.message}</span>
            )}
            <small className="form-hint">
              Sessions typically start as "pending" and become "active" when started
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(quizIdFromUrl ? `/quizzes/${quizIdFromUrl}` : '/quizzes')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionCreate;


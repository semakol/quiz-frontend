import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { signupSchema } from '../utils/validation';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError, isAuthenticated } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signupSchema),
  });

  useEffect(() => {
    clearError();
  }, [clearError]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/', { replace: true });
  //   }
  // }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    clearError();
    const result = await signup({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || 'user',
    });

    if (result.success) {
      navigate('/login', { replace: true, state: { message: 'Аккаунт успешно создан! Пожалуйста, войдите.' } });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Зарегистрироваться</h1>
        <p className="auth-subtitle">Создать новый аккаунт</p>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Логин <span className="required">*</span>
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className={`form-input ${errors.username ? 'form-input-error' : ''}`}
              placeholder="Введите ваш логин"
              disabled={isLoading}
            />
            {errors.username && (
              <span className="error-text">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="Введите ваш email"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-text">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль <span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={`form-input ${errors.password ? 'form-input-error' : ''}`}
              placeholder="Введите ваш пароль"
              disabled={isLoading}
            />
            {errors.password && (
              <span className="error-text">{errors.password.message}</span>
            )}
            <small className="form-hint">
              Должно быть не менее 6 символов, включая заглавные буквы, цифры и специальные символы.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Подтвердить пароль <span className="required">*</span>
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
              placeholder="Подтвердите ваш пароль"
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Роль пользователя
            </label>
            <select
              id="role"
              {...register('role')}
              className="form-input"
              disabled={isLoading}
            >
              <option value="user">Пользователь</option>
              <option value="admin">Редактор</option>
            </select>
            {errors.role && (
              <span className="error-text">{errors.role.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Создание аккаунта...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Есть аккаунт{' '}
            <Link to="/login" className="auth-link">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Quiz.css';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="quiz-container">
      <h1>Приветствую{user ? `, ${user.username}` : ''}!</h1>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Начать</h2>
          <p>Начните создавать тесты</p>
          <Link to="/quizzes" className="btn btn-primary">
            Мои тесты
          </Link>
        </div>
        <div className="dashboard-card">
          <h2>Создать новый тест</h2>
          <p>Начните создавать ваш тест</p>
          <Link to="/quizzes/new" className="btn btn-primary">
            Создать тест
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import './Quiz.css';

const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="quiz-container">
      <h1>Welcome{user ? `, ${user.username}` : ''}!</h1>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Get Started</h2>
          <p>Create and manage your quizzes</p>
          <Link to="/quizzes" className="btn btn-primary">
            View All Quizzes
          </Link>
        </div>
        <div className="dashboard-card">
          <h2>Create New Quiz</h2>
          <p>Start building your quiz now</p>
          <Link to="/quizzes/new" className="btn btn-primary">
            Create Quiz
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


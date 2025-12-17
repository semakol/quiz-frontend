import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import QuizDetail from './pages/QuizDetail';
import QuizCreate from './pages/QuizCreate';
import QuizEdit from './pages/QuizEdit';
import QuestionCreate from './pages/QuestionCreate';
import QuestionEdit from './pages/QuestionEdit';
import SessionCreate from './pages/SessionCreate';
import Session from './pages/Session';

import './App.css';

function App() {
  const { initialize, isAuthenticated } = useAuthStore();
  WebSocket.
  // Initialize auth state from storage on app load
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Login />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Signup />
            } 
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes"
            element={
              <ProtectedRoute>
                <QuizList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes/new"
            element={
              <ProtectedRoute>
                <QuizCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes/:id"
            element={
              <ProtectedRoute>
                <QuizDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes/:id/edit"
            element={
              <ProtectedRoute>
                <QuizEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes/:id/questions/new"
            element={
              <ProtectedRoute>
                <QuestionCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quizzes/:id/questions/:questionId/edit"
            element={
              <ProtectedRoute>
                <QuestionEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions/create"
            element={
              <ProtectedRoute>
                <SessionCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sessions/:id"
            element={
              <ProtectedRoute>
                <Session />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

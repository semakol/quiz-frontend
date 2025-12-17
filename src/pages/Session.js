import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuiz } from '../api/quizzes';
import { getQuestionsByQuiz } from '../api/questions';
import useAuthStore from '../store/authStore';
import './Session.css';

const Session = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    loadSessionData();
  }, [id]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      if (currentQuestion.time_limit) {
        setTimeRemaining(currentQuestion.time_limit);
      } else {
        setTimeRemaining(null);
      }
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleNextQuestion();
            return null;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const loadSessionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const quizId = 1;
      
      const [quizData, questionsData] = await Promise.all([
        getQuiz(quizId).catch(() => null),
        getQuestionsByQuiz(quizId).catch(() => []),
      ]);

      if (!quizData) {
        setError('Quiz not found for this session');
        return;
      }

      setQuiz(quizData);
      setQuestions(Array.isArray(questionsData) ? questionsData : []);
    } catch (err) {
      setError(err.message || 'Failed to load session data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerValue,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let totalQuestions = questions.length;

    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer !== undefined) {
        if (question.type === 'multiple_choice' || question.type === 'true_false') {
          const correctAnswer = question.answers?.find((a) => a.is_correct);
          if (correctAnswer && userAnswer === correctAnswer.id) {
            correctCount++;
          }
        } else if (question.type === 'short_answer') {
        }
      }
    });

    setResults({
      correct: correctCount,
      total: totalQuestions,
      percentage: Math.round((correctCount / totalQuestions) * 100),
    });
    setIsSubmitted(true);
  };

  const formatTime = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="session-container">
        <div className="loading">Loading session...</div>
      </div>
    );
  }

  if (error && !quiz) {
    return (
      <div className="session-container">
        <div className="error-message" role="alert">
          {error}
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="session-container">
        <div className="error-message">No questions available for this session</div>
        <button className="btn btn-secondary" onClick={() => navigate('/quizzes')}>
          Back to Quizzes
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const sortedQuestions = [...questions].sort((a, b) => a.order_index - b.order_index);
  const currentSortedIndex = sortedQuestions.findIndex((q) => q.id === currentQuestion.id);

  if (isSubmitted && results) {
    return (
      <div className="session-container">
        <div className="session-results">
          <h1>Quiz Complete!</h1>
          <div className="results-summary">
            <div className="results-score">
              <span className="results-number">{results.correct}</span>
              <span className="results-label">out of {results.total} correct</span>
            </div>
            <div className="results-percentage">
              {results.percentage}%
            </div>
          </div>
          <div className="results-actions">
            <button className="btn btn-primary" onClick={() => navigate('/quizzes')}>
              Back to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="session-container">
      <div className="session-header">
        <h1>{quiz.title}</h1>
        {quiz.description && <p className="session-description">{quiz.description}</p>}
      </div>

      <div className="session-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentSortedIndex + 1) / sortedQuestions.length) * 100}%` }}
          />
        </div>
        <div className="progress-text">
          Question {currentSortedIndex + 1} of {sortedQuestions.length}
        </div>
      </div>

      {timeRemaining !== null && (
        <div className="session-timer">
          <span className="timer-icon">⏱</span>
          <span className="timer-text">{formatTime(timeRemaining)}</span>
        </div>
      )}

      <div className="session-question">
        <div className="question-header">
          <span className="question-number">Question {currentSortedIndex + 1}</span>
          <span className="question-type">{currentQuestion.type}</span>
        </div>
        <h2 className="question-text">{currentQuestion.text || 'Question'}</h2>

        <div className="question-answers">
          {currentQuestion.type === 'multiple_choice' || currentQuestion.type === 'true_false' ? (
            <div className="answer-options">
              {currentQuestion.answers?.map((answer) => (
                <label key={answer.id} className="answer-option">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={answer.id}
                    checked={answers[currentQuestion.id] === answer.id}
                    onChange={() => handleAnswerChange(currentQuestion.id, answer.id)}
                  />
                  <span>{answer.text}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              className="form-input form-textarea"
              placeholder="Enter your answer..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              rows="4"
            />
          )}
        </div>
      </div>

      <div className="session-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePreviousQuestion}
          disabled={currentSortedIndex === 0}
        >
          ← Previous
        </button>
        {currentSortedIndex === sortedQuestions.length - 1 ? (
          <button className="btn btn-primary" onClick={handleSubmit}>
            Submit Quiz
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNextQuestion}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default Session;

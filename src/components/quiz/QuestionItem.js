import './Question.css';

const QuestionItem = ({ question, onEdit, onDelete, isAuthor }) => {
  const formatTimeLimit = (seconds) => {
    if (!seconds) return 'No time limit';
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="question-item">
      <div className="question-item-header">
        <div className="question-item-info">
          <span className="question-order">#{question.order_index + 1}</span>
          <span className="question-type-badge">{question.type}</span>
          {question.time_limit && (
            <span className="question-time-limit">⏱ {formatTimeLimit(question.time_limit)}</span>
          )}
        </div>
        {isAuthor && (
          <div className="question-item-actions">
            <button
              className="btn btn-small btn-secondary"
              onClick={() => onEdit(question)}
            >
              Edit
            </button>
            <button
              className="btn btn-small btn-danger"
              onClick={() => onDelete(question.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="question-item-content">
        <p className="question-text">{question.text || '(No text)'}</p>
        {question.answers && question.answers.length > 0 && (
          <div className="question-answers">
            <h4>Answers:</h4>
            <ul className="answer-list">
              {question.answers.map((answer) => (
                <li
                  key={answer.id}
                  className={`answer-item ${answer.is_correct ? 'answer-correct' : ''}`}
                >
                  <span className="answer-text">{answer.text}</span>
                  {answer.is_correct && (
                    <span className="answer-badge">✓ Correct</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionItem;


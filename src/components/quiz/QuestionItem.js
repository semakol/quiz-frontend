import './Question.css';

const QuestionItem = ({ question, onEdit, onDelete, isAuthor }) => {
  const formatTimeLimit = (seconds) => {
    if (!seconds) return 'Неограничено';
    if (seconds < 60) return `${seconds} секунд`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) return `${minutes} минут${minutes > 1 ? 'ы' : ''}`;
    return `${minutes}м ${remainingSeconds}с`;
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
              Редактировать
            </button>
            <button
              className="btn btn-small btn-danger"
              onClick={() => onDelete(question.id)}
            >
              Удалить
            </button>
          </div>
        )}
      </div>
      <div className="question-item-content">
        <p className="question-text">{question.text || '(No text)'}</p>
        {question.answers && question.answers.length > 0 && (
          <div className="question-answers">
            <h4>Ответ:</h4>
            <ul className="answer-list">
              {question.answers.map((answer) => (
                <li
                  key={answer.id}
                  className={`answer-item ${answer.is_correct ? 'answer-correct' : ''}`}
                >
                  <span className="answer-text">{answer.text}</span>
                  {answer.is_correct && (
                    <span className="answer-badge">✓ Правильный</span>
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


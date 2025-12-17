import QuestionItem from './QuestionItem';
import './Question.css';

const QuestionList = ({ questions, onEdit, onDelete, isAuthor }) => {
  if (!questions || questions.length === 0) {
    return (
      <div className="question-list-empty">
        <p>No questions yet. Add your first question to get started!</p>
      </div>
    );
  }

  const sortedQuestions = [...questions].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="question-list">
      {sortedQuestions.map((question) => (
        <QuestionItem
          key={question.id}
          question={question}
          onEdit={onEdit}
          onDelete={onDelete}
          isAuthor={isAuthor}
        />
      ))}
    </div>
  );
};

export default QuestionList;


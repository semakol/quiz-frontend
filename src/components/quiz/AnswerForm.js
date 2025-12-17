import { useState } from 'react';
import './Question.css';

const AnswerForm = ({ answer, index, onChange, onRemove, canRemove }) => {
  const handleChange = (field, value) => {
    onChange(index, { ...answer, [field]: value });
    // console.log(answer);
  };

  return (
    <div className="answer-form-item">
      <div className="answer-form-header">
        <span className="answer-form-label">Answer {index + 1}</span>
        {canRemove && (
          <button
            type="button"
            className="btn btn-small btn-danger"
            onClick={() => onRemove(index)}
          >
            Remove
          </button>
        )}
      </div>
      <div className="answer-form-content">
        <input
          type="text"
          value={answer.text || ''}
          onChange={(e) => handleChange('text', e.target.value)}
          className="form-input"
          placeholder="Enter answer text"
        />
        <label className="form-checkbox-label">
          <input
            type="checkbox"
            checked={answer.is_correct || false}
            onChange={(e) => handleChange('is_correct', e.target.checked)}
            className="form-checkbox"
          />
          <span>Mark as correct answer</span>
        </label>
      </div>
    </div>
  );
};

export default AnswerForm;


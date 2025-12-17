import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AnswerForm from './AnswerForm';
import { questionSchema } from '../../utils/validation';
import './Question.css';

const QuestionForm = ({ question, onSubmit, onCancel, quizId, existingQuestionsCount = 0 }) => {
  const [answers, setAnswers] = useState(
    question?.answers?.map(a => ({ text: a.text, is_correct: a.is_correct })) || [
      { text: '', is_correct: false },
      { text: '', is_correct: false },
    ]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(questionSchema),
    defaultValues: {
      text: question?.text || '',
      type: question?.type || 'multiple_choice',
      time_limit: question?.time_limit || null,
      order_index: question?.order_index ?? existingQuestionsCount,
      media_id: question?.media_id || null,
    },
  });

  const questionType = watch('type');

  useEffect(() => {
    // For true/false questions, automatically set up 2 answers
    if (questionType === 'true_false' && answers.length !== 2) {
      setAnswers([
        { text: 'True', is_correct: false },
        { text: 'False', is_correct: false },
      ]);
    }
  }, [questionType]);

  const handleAnswerChange = (index, updatedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[index] = updatedAnswer;
    setAnswers(newAnswers);
    // console.log(newAnswers);
  };

  const handleAddAnswer = () => {
    setAnswers([...answers, { text: '', is_correct: false }]);
  };

  const handleRemoveAnswer = (index) => {
    if (answers.length > 1) {
      const newAnswers = answers.filter((_, i) => i !== index);
      setAnswers(newAnswers);
    }
  };

  const handleFormSubmit = (data) => {
    console.log(answers);
    const hasCorrectAnswer = answers.some(a => a.is_correct);
    console.log(hasCorrectAnswer);
    if (!hasCorrectAnswer) {
      alert('Должен быть выбран хотя бы один правильный ответ');
      return;
    }

    const allAnswersHaveText = answers.every(a => a.text.trim() !== '');
    if (!allAnswersHaveText) {
      alert('Все ответы должны иметь текст');
      return;
    }

    onSubmit({
      ...data,
      answers: answers.map(a => ({
        text: a.text.trim(),
        is_correct: a.is_correct,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="question-form">
      <div className="form-group">
        <label htmlFor="text" className="form-label">
          Текст вопроса
        </label>
        <textarea
          id="text"
          {...register('text')}
          className={`form-input form-textarea ${errors.text ? 'form-input-error' : ''}`}
          placeholder="Введите текст вопроса"
          rows="3"
        />
        {errors.text && (
          <span className="error-text">{errors.text.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="type" className="form-label">
          Тип вопроса <span className="required">*</span>
        </label>
        <select
          id="type"
          {...register('type')}
          className={`form-input ${errors.type ? 'form-input-error' : ''}`}
        >
          <option value="multiple_choice">Multiple Choice</option>
          {/* <option value="true_false">True/False</option>
          <option value="short_answer">Short Answer</option> */}
        </select>
        {errors.type && (
          <span className="error-text">{errors.type.message}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="order_index" className="form-label">
            Order Index <span className="required">*</span>
          </label>
          <input
            id="order_index"
            type="number"
            {...register('order_index', { valueAsNumber: true })}
            className={`form-input ${errors.order_index ? 'form-input-error' : ''}`}
            min="0"
          />
          {errors.order_index && (
            <span className="error-text">{errors.order_index.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="time_limit" className="form-label">
            Ограничение времени (секунды)
          </label>
          <input
            id="time_limit"
            type="number"
            {...register('time_limit', { valueAsNumber: true })}
            className={`form-input ${errors.time_limit ? 'form-input-error' : ''}`}
            min="1"
            placeholder="Необязательно"
          />
          {errors.time_limit && (
            <span className="error-text">{errors.time_limit.message}</span>
          )}
        </div>
      </div>

      {/* <div className="form-group">
        <label htmlFor="media_id" className="form-label">
          Media ID (optional)
        </label>
        <input
          id="media_id"
          type="number"
          {...register('media_id', { valueAsNumber: true })}
          className={`form-input ${errors.media_id ? 'form-input-error' : ''}`}
          placeholder="Optional"
        />
        {errors.media_id && (
          <span className="error-text">{errors.media_id.message}</span>
        )}
      </div> */}

      <div className="form-group">
        <div className="answers-section">
          <div className="answers-section-header">
            <label className="form-label">Ответы <span className="required">*</span></label>
            {questionType !== 'true_false' && (
              <button
                type="button"
                className="btn btn-small btn-secondary"
                onClick={handleAddAnswer}
              >
                + Добавить ответ
              </button>
            )}
          </div>
          {answers.map((answer, index) => (
            <AnswerForm
              key={index}
              answer={answer}
              index={index}
              onChange={handleAnswerChange}
              onRemove={handleRemoveAnswer}
              canRemove={answers.length > 1 && questionType !== 'true_false'}
            />
          ))}
          {errors.answers && (
            <span className="error-text">{errors.answers.message}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="btn btn-primary">
          {question ? 'Обновить вопрос' : 'Создать вопрос'}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;


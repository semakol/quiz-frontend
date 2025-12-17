import apiClient from './client';

/**
 * Create a question for a quiz
 * @param {number} quizId - Quiz ID
 * @param {Object} questionData - Question data
 * @param {string} questionData.text - Question text
 * @param {string} questionData.type - Question type
 * @param {number} [questionData.time_limit] - Time limit in seconds
 * @param {number} questionData.order_index - Order index
 * @param {number} [questionData.media_id] - Media ID
 * @param {Array} [questionData.answers] - Array of answers
 * @returns {Promise<Object>} Created question data
 */
export const createQuestion = async (quizId, questionData) => {
  const response = await apiClient.post(`/questions/quiz/${quizId}`, {
    text: questionData.text || null,
    type: questionData.type,
    time_limit: questionData.time_limit || null,
    order_index: questionData.order_index,
    media_id: questionData.media_id || null,
    answers: (questionData.answers || []).map(answer => ({
      question_id: 0, // Placeholder - backend should replace with actual question_id
      text: answer.text,
      is_correct: answer.is_correct || false,
    })),
  });
  return response.data;
};

/**
 * Update an existing question
 * @param {number} questionId - Question ID
 * @param {Object} questionData - Updated question data (all fields optional)
 * @returns {Promise<Object>} Updated question data
 */
export const updateQuestion = async (questionId, questionData) => {
  const response = await apiClient.put(`/questions/${questionId}`, {
    text: questionData.text ?? undefined,
    type: questionData.type ?? undefined,
    time_limit: questionData.time_limit ?? undefined,
    order_index: questionData.order_index ?? undefined,
    media_id: questionData.media_id ?? undefined,
    answers: (questionData.answers || []).map(answer => ({
      question_id: 0, // Placeholder - backend should replace with actual question_id
      text: answer.text,
      is_correct: answer.is_correct || false,
    })),
  });
  return response.data;
};

/**
 * Delete a question
 * @param {number} questionId - Question ID
 * @returns {Promise<void>}
 */
export const deleteQuestion = async (questionId) => {
  await apiClient.delete(`/questions/${questionId}`);
};

/**
 * Get questions for a quiz
 * @param {number} quizId - Quiz ID (required)
 * @param {Object} params - Query parameters
 * @param {number} [params.skip=0] - Number of items to skip
 * @param {number} [params.limit=100] - Maximum number of items to return
 * @returns {Promise<Array>} Array of questions
 */
export const getQuestionsByQuiz = async (quizId, params = {}) => {
  const response = await apiClient.get('/questions/', {
    params: {
      quiz_id: quizId,
      skip: params.skip || 0,
      limit: params.limit || 100,
    },
  });
  return response.data;
};

/**
 * Get a single question by ID
 * @param {number} questionId - Question ID
 * @returns {Promise<Object>} Question data
 */
export const getQuestion = async (questionId) => {
  const response = await apiClient.get(`/questions/${questionId}`);
  return response.data;
};

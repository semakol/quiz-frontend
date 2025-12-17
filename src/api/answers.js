import apiClient from './client';

/**
 * Create an answer
 * @param {Object} answerData - Answer data
 * @param {number} answerData.question_id - Question ID
 * @param {string} answerData.text - Answer text
 * @param {boolean} [answerData.is_correct=false] - Whether answer is correct
 * @returns {Promise<Object>} Created answer data
 */
export const createAnswer = async (answerData) => {
  const response = await apiClient.post('/answers/', {
    question_id: answerData.question_id,
    text: answerData.text,
    is_correct: answerData.is_correct || false,
  });
  return response.data;
};

/**
 * Get an answer by ID
 * @param {number} answerId - Answer ID
 * @returns {Promise<Object>} Answer data
 */
export const getAnswer = async (answerId) => {
  const response = await apiClient.get(`/answers/${answerId}`);
  return response.data;
};

/**
 * Update an existing answer
 * @param {number} answerId - Answer ID
 * @param {Object} answerData - Updated answer data
 * @param {string} [answerData.text] - Answer text
 * @param {boolean} [answerData.is_correct] - Whether answer is correct
 * @returns {Promise<Object>} Updated answer data
 */
export const updateAnswer = async (answerId, answerData) => {
  const response = await apiClient.put(`/answers/${answerId}`, {
    text: answerData.text ?? undefined,
    is_correct: answerData.is_correct ?? undefined,
  });
  return response.data;
};

/**
 * Delete an answer
 * @param {number} answerId - Answer ID
 * @returns {Promise<void>}
 */
export const deleteAnswer = async (answerId) => {
  await apiClient.delete(`/answers/${answerId}`);
};

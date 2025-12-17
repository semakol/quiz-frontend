import apiClient from './client';

/**
 * List all quizzes with pagination
 * @param {Object} params - Query parameters
 * @param {number} [params.skip=0] - Number of items to skip
 * @param {number} [params.limit=100] - Maximum number of items to return
 * @returns {Promise<Array>} Array of quizzes
 */
export const listQuizzes = async (params = {}) => {
  const response = await apiClient.get('/quizzes/', {
    params: {
      skip: params.skip || 0,
      limit: params.limit || 100,
    },
  });
  return response.data;
};

/**
 * Get a single quiz by ID
 * @param {number} quizId - Quiz ID
 * @returns {Promise<Object>} Quiz data
 */
export const getQuiz = async (quizId) => {
  const response = await apiClient.get(`/quizzes/${quizId}`);
  return response.data;
};

/**
 * Create a new quiz
 * @param {Object} quizData - Quiz data
 * @param {string} quizData.title - Quiz title
 * @param {string} [quizData.description] - Quiz description
 * @param {number} quizData.author_id - Author user ID
 * @param {boolean} [quizData.is_public=false] - Whether quiz is public
 * @returns {Promise<Object>} Created quiz data
 */
export const createQuiz = async (quizData) => {
  const response = await apiClient.post('/quizzes/', {
    title: quizData.title,
    description: quizData.description || null,
    author_id: quizData.author_id,
    is_public: quizData.is_public || false,
  });
  return response.data;
};

/**
 * Update an existing quiz
 * @param {number} quizId - Quiz ID
 * @param {Object} quizData - Updated quiz data (all fields optional)
 * @param {string} [quizData.title] - Quiz title
 * @param {string} [quizData.description] - Quiz description
 * @param {number} [quizData.author_id] - Author user ID
 * @param {boolean} [quizData.is_public] - Whether quiz is public
 * @returns {Promise<Object>} Updated quiz data
 */
export const updateQuiz = async (quizId, quizData) => {
  const response = await apiClient.put(`/quizzes/${quizId}`, {
    title: quizData.title ?? undefined,
    description: quizData.description ?? undefined,
    author_id: quizData.author_id ?? undefined,
    is_public: quizData.is_public ?? undefined,
  });
  return response.data;
};

/**
 * Delete a quiz
 * @param {number} quizId - Quiz ID
 * @returns {Promise<void>}
 */
export const deleteQuiz = async (quizId) => {
  await apiClient.delete(`/quizzes/${quizId}`);
};

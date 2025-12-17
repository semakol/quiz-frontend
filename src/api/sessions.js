import apiClient from './client';

/**
 * Create a new quiz session
 * @param {Object} sessionData - Session data
 * @param {number} sessionData.quiz_id - Quiz ID
 * @param {number} sessionData.host_id - Host user ID
 * @param {string} sessionData.url - Session URL
 * @param {string} sessionData.status - Session status (e.g., 'pending', 'active', 'completed')
 * @returns {Promise<Object>} Created session data
 */
export const createSession = async (sessionData) => {
  const response = await apiClient.post('/sessions/', {
    quiz_id: sessionData.quiz_id,
    host_id: sessionData.host_id,
    url: sessionData.url,
    status: sessionData.status,
  });
  return response.data;
};

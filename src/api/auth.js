import apiClient from './client';
import { storage } from '../utils/storage';

/**
 * Sign up a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} [userData.role='user'] - User role (default: 'user')
 * @returns {Promise<Object>} User data
 */
export const signup = async (userData) => {
  const response = await apiClient.post('/auth/signup', {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'user',
  });
  return response.data;
};

/**
 * Login and get access token (OAuth2 password flow)
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} Token data with access_token and token_type
 */
export const login = async (username, password) => {
  // OAuth2 password flow requires form-urlencoded data
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  params.append('grant_type', 'password');

  const response = await apiClient.post('/auth/token', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const tokenData = response.data;
  
  // Store token
  if (tokenData.access_token) {
    storage.setToken(tokenData.access_token);
  }

  return tokenData;
};

/**
 * Get current user details
 * @param {number} userId - User ID
 * @returns {Promise<Object>} User data
 */
export const getUser = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

/**
 * Logout - clear stored token and user data
 */
export const logout = () => {
  storage.clear();
};

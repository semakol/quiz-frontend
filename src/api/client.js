import axios from 'axios';
import { storage } from '../utils/storage';

// Create axios instance with base URL
// In development, use relative URLs to leverage the proxy in package.json
// In production, use the environment variable or default to localhost
const getBaseURL = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  // In development, use relative URL to leverage proxy
  // In production, default to localhost:8000
  if (process.env.NODE_ENV === 'development') {
    return '';
  }
  return 'http://localhost:8000';
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add authentication token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      storage.clear();
      // Only redirect if not already on login/signup page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        window.location.href = '/login';
      }
    }

    // Handle network errors
    if (!error.response) {
      error.message = 'Network error. Please check your connection.';
    }

    // Handle validation errors (422)
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.detail;
      if (validationErrors && Array.isArray(validationErrors)) {
        error.validationErrors = validationErrors;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

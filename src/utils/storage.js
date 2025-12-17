
const TOKEN_KEY = 'quiz_app_token';
const USER_KEY = 'quiz_app_user';

export const storage = {
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token from storage:', error);
      return null;
    }
  },

  setToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error setting token in storage:', error);
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token from storage:', error);
    }
  },

  getUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  },

  setUser: (user) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting user in storage:', error);
    }
  },

  removeUser: () => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing user from storage:', error);
    }
  },

  clear: () => {
    storage.removeToken();
    storage.removeUser();
  },
};

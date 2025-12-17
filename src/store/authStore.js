import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../utils/storage';
import * as authAPI from '../api/auth';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initialize: () => {
        const token = storage.getToken();
        const user = storage.getUser();
        if (token && user) {
          set({
            token,
            user,
            isAuthenticated: true,
          });
        }
      },

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const tokenData = await authAPI.login(username, password);
          
          set({
            token: tokenData.access_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          storage.setToken(tokenData.access_token);

          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.detail 
            ? (Array.isArray(error.response.data.detail) 
                ? error.response.data.detail.map(e => e.msg).join(', ')
                : error.response.data.detail)
            : error.message || 'Login failed';
          
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      signup: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const newUser = await authAPI.signup(userData);
          
          set({
            user: newUser,
            isLoading: false,
            error: null,
          });

          storage.setUser(newUser);

          return { success: true, user: newUser };
        } catch (error) {
          const errorMessage = error.response?.data?.detail 
            ? (Array.isArray(error.response.data.detail) 
                ? error.response.data.detail.map(e => e.msg).join(', ')
                : error.response.data.detail)
            : error.message || 'Signup failed';
          
          set({
            error: errorMessage,
            isLoading: false,
          });
          return { success: false, error: errorMessage };
        }
      },

      setUser: (user) => {
        set({ user });
        storage.setUser(user);
      },

      logout: () => {
        authAPI.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;


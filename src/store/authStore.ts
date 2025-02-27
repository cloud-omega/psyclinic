import { create } from 'zustand';
import { AuthState } from '../types';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: 'google' | 'facebook' | 'linkedin') => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // This would be replaced with actual API call
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to login', 
        isLoading: false 
      });
    }
  },

  loginWithProvider: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      // This would be replaced with actual OAuth flow
      // For now, we'll just simulate the process
      window.location.href = `/api/auth/${provider}`;
      // The actual token handling would happen after redirect back to the app
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : `Failed to login with ${provider}`, 
        isLoading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isAuthenticated: false });
      return;
    }

    try {
      // Verify token validity
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if ((decoded.exp as number) < currentTime) {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
        return;
      }

      // Get user data
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      set({ 
        user: response.data, 
        token, 
        isAuthenticated: true 
      });
    } catch (error) {
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Session expired' 
      });
    }
  }
}));

export default useAuthStore;
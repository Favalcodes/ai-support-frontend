import { create } from 'zustand';
import { User } from '../types/user.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  updateUser: (user: User) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Initialize from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        user,
        token,
        isAuthenticated: true,
      };
    } catch (error) {
      // Invalid JSON in localStorage, clear it
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }

  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState = getInitialState();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialState.user,
  token: initialState.token,
  isAuthenticated: initialState.isAuthenticated,
  isLoading: false,

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  setToken: (token) => {
    localStorage.setItem('auth_token', token);
    set({ token, isAuthenticated: true });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  login: (user, token) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));

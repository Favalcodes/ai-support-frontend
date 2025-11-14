// import { create } from 'zustand';
// import { User } from '../types/user.types';

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
  
//   // Actions
//   setUser: (user: User) => void;
//   setToken: (token: string) => void;
//   login: (user: User, token: string) => void;
//   logout: () => void;
//   setLoading: (loading: boolean) => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   token: localStorage.getItem('auth_token'),
//   isAuthenticated: !!localStorage.getItem('auth_token'),
//   isLoading: false,

//   setUser: (user) => set({ user }),

//   setToken: (token) => {
//     localStorage.setItem('auth_token', token);
//     set({ token, isAuthenticated: true });
//   },

//   login: (user, token) => {
//     localStorage.setItem('auth_token', token);
//     localStorage.setItem('user', JSON.stringify(user));
//     set({ user, token, isAuthenticated: true });
//   },

//   logout: () => {
//     localStorage.removeItem('auth_token');
//     localStorage.removeItem('user');
//     set({ user: null, token: null, isAuthenticated: false });
//   },

//   setLoading: (loading) => set({ isLoading: loading }),
// }));

import { create } from 'zustand';
import { User, UserRole } from '../types/user.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// MOCK USER FOR TESTING
const mockUser: User = {
  id: 'agent-1',
  email: 'agent@company.com',
  first_name: 'John',
  last_name: 'Doe',
  role: UserRole.COMPANY_STAFF,
  company_id: 'company-1',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,  // Set mock user
  token: 'mock-token',  // Set mock token
  isAuthenticated: true,  // Set to true
  isLoading: false,

  setUser: (user) => set({ user }),

  setToken: (token) => {
    localStorage.setItem('auth_token', token);
    set({ token, isAuthenticated: true });
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
import { create } from 'zustand';
import { User } from '../types/user.types';
import { Permission } from '../types/permission.types';

interface AuthState {
  user: User | null;
  token: string | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setPermissions: (permissions: Permission[]) => void;
  updateUser: (user: User) => void;
  login: (user: User, token: string, permissions?: Permission[]) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
}

// Initialize from localStorage
const getInitialState = () => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  const permissionsStr = localStorage.getItem('permissions');

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      const permissions = permissionsStr ? JSON.parse(permissionsStr) : [];
      return {
        user,
        token,
        permissions,
        isAuthenticated: true,
      };
    } catch (error) {
      // Invalid JSON in localStorage, clear it
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
    }
  }

  return {
    user: null,
    token: null,
    permissions: [],
    isAuthenticated: false,
  };
};

const initialState = getInitialState();

export const useAuthStore = create<AuthState>((set, get) => ({
  user: initialState.user,
  token: initialState.token,
  permissions: initialState.permissions,
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

  setPermissions: (permissions) => {
    localStorage.setItem('permissions', JSON.stringify(permissions));
    set({ permissions });
  },

  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },

  login: (user, token, permissions = []) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('permissions', JSON.stringify(permissions));
    set({ user, token, permissions, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    set({ user: null, token: null, permissions: [], isAuthenticated: false });
  },

  setLoading: (loading) => set({ isLoading: loading }),

  // Permission checking methods
  hasPermission: (permission) => {
    const { permissions } = get();
    return permissions.includes(permission);
  },

  hasAnyPermission: (requiredPermissions) => {
    const { permissions } = get();
    return requiredPermissions.some((p) => permissions.includes(p));
  },

  hasAllPermissions: (requiredPermissions) => {
    const { permissions } = get();
    return requiredPermissions.every((p) => permissions.includes(p));
  },
}));

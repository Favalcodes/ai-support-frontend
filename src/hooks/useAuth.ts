import { useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService, type RegisterRequest } from '../services/auth.service';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, logout, setLoading, setUser } =
    useAuthStore();

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const response = await authService.login({ email, password });
        login(response.data.user, response.data.token, response.data.permissions);
        return {
          success: true,
          mustChangePassword: response.data.mustChangePassword || false,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || 'Login failed',
        };
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading]
  );

  const handleRegister = useCallback(
    async (data: RegisterRequest) => {
      try {
        setLoading(true);
        const response = await authService.register(data);
        // Automatically log in after successful registration
        if (response.data) {
          login(response.data.user, response.data.token, response.data.permissions);
        }
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.response?.data?.message || 'Registration failed',
        };
      } finally {
        setLoading(false);
      }
    },
    [login, setLoading]
  );

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
    }
  }, [logout]);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  }, [setUser, logout]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
  };
};
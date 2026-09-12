import { useEffect, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authService } from '../services/auth.service';

/**
 * Periodically confirm the stored token is still valid and log the user out if it
 * is not.
 *
 * This was commented out wholesale because the /auth/verify endpoint it depends on
 * did not exist, which left expired sessions to fail later at a random API call.
 */
export const useTokenExpirationCheck = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const checkTokenValidity = async () => {
      try {
        const isValid = await authService.verifyToken();

        if (!isValid) {
          logout();
          sessionStorage.setItem('auth_error', 'Your session has expired. Please login again.');
          window.location.href = '/login';
        }
      } catch (error) {
        // A network blip should not sign the user out; only an explicit
        // invalid-token answer from the server does that.
        console.error('Token verification failed:', error);
      }
    };

    checkTokenValidity();
    intervalRef.current = setInterval(checkTokenValidity, 5 * 60 * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, logout]);
};

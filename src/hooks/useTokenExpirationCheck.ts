// import { useEffect, useRef } from 'react';
// import { useAuthStore } from '../stores/authStore';
// import { authService } from '../services/auth.service';

// /**
//  * Hook to periodically check if the token is still valid
//  * Automatically logs out the user if the token has expired
//  */
// export const useTokenExpirationCheck = () => {
//   const { isAuthenticated, logout } = useAuthStore();
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     // Only run for authenticated users
//     if (!isAuthenticated) {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//         intervalRef.current = null;
//       }
//       return;
//     }

//     // Check token validity every 5 minutes
//     const checkTokenValidity = async () => {
//       try {
//         const isValid = await authService.verifyToken();

//         if (!isValid) {
//           // Token is invalid/expired, logout user
//           logout();

//           // Store message for login page
//           sessionStorage.setItem('auth_error', 'Your session has expired. Please login again.');

//           // Redirect to login
//           window.location.href = '/login';
//         }
//       } catch (error) {
//         // If verification fails, assume token is invalid
//         console.error('Token verification failed:', error);
//       }
//     };

//     // Initial check
//     checkTokenValidity();

//     // Set up periodic check (every 5 minutes)
//     intervalRef.current = setInterval(checkTokenValidity, 5 * 60 * 1000);

//     // Cleanup on unmount
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isAuthenticated, logout]);
// };

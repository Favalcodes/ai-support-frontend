import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../config/env';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we're already handling a logout to prevent multiple redirects
let isLoggingOut = false;

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - Token expired or invalid
          if (!isLoggingOut) {
            isLoggingOut = true;

            // Clear all auth data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('permissions');

            // Show a message to the user
            const errorMessage = (error.response.data as any)?.message || 'Your session has expired. Please login again.';

            // Store the error message so the login page can explain the redirect
            sessionStorage.setItem('auth_error', errorMessage);

            // Redirect to login page
            window.location.href = '/login';

            // Reset flag after a short delay
            setTimeout(() => {
              isLoggingOut = false;
            }, 1000);
          }
          break;
        case 403:
          console.error('Forbidden - insufficient permissions');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error - please try again later');
          break;
        default:
          console.error('An error occurred:', error.message);
      }
    } else if (error.request) {
      console.error('Network error - please check your connection');
    }
    return Promise.reject(error);
  }
);

export default api;
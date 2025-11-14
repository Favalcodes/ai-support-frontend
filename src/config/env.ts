export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  appName: import.meta.env.VITE_APP_NAME || 'AI Support Platform',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
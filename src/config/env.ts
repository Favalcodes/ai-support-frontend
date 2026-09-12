/**
 * Runtime configuration.
 *
 * The defaults matter: the backend listens on 4001 and mounts the API under
 * /api/v1. The previous fallbacks pointed at port 3000 with no path, so any build
 * without a .env silently talked to the wrong place.
 */
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4001/api/v1',
  socketUrl: import.meta.env.VITE_SOCKET_URL || 'http://localhost:4001',
  appName: import.meta.env.VITE_APP_NAME || 'rlayAi',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

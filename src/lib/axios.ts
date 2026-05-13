import axios, { AxiosError, AxiosInstance } from 'axios';

// Get API base URL from environment or default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8003';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost/cex';

/**
 * Create a centralized axios instance with interceptors
 * Handles auth tokens, error responses, and request/response transformation
 */
export const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Request interceptor - Add auth token to headers
   */
  instance.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * Response interceptor - Handle errors and token refresh
   */
  instance.interceptors.response.use(
    (response) => {
      // Return the full response object to maintain consistency
      return response;
    },
    (error: AxiosError) => {
      // Handle 401 Unauthorized - refresh token or redirect to login
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          // Don't redirect if already on login page or if no token exists
          const currentPath = window.location.pathname;
          const hasToken = localStorage.getItem('accessToken');

          if (!hasToken || currentPath.includes('/account/login')) {
            // Don't redirect if no token or already on login page
            return Promise.reject(error);
          }

          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = '/account/login';
        }
      }

      // Handle 403 Forbidden
      if (error.response?.status === 403) {
        console.error('Forbidden: You do not have permission to access this resource');
      }

      // Handle 500 Server Error
      if (error.response?.status === 500) {
        console.error('Server Error: Please try again later');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Export singleton instance
export const axiosInstance = createAxiosInstance();

// Export API and WS URLs for WebSocket connection
export { API_BASE_URL, WS_BASE_URL };

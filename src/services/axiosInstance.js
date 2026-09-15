import axios from 'axios';

/**
 * Dynamically resolves the API Base URL supporting both:
 * 1. Vite (`import.meta.env.VITE_API_BASE_URL`)
 * 2. Create React App (`process.env.REACT_APP_API_BASE_URL`)
 */
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) ||
  '/api';  // ✅ Relative URL → routes through Vite proxy → no CORS issues

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout to allow AI Vision OCR processing
});

apiClient.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const { token } = JSON.parse(storedUser);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse auth token from localStorage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized access ? redirecting to login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;

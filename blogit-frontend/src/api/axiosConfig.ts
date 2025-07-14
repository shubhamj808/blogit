import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const timeout = Number(import.meta.env.VITE_API_TIMEOUT) || 5000;

const api = axios.create({
  baseURL,
  timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (userId) {
      config.headers['X-User-Id'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Network error
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 'error'
      });
    }

    // Handle specific error cases
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    switch (error.response?.status) {
      case 401:
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
        break;
      case 403:
        // Forbidden
        return Promise.reject({
          message: 'You do not have permission to perform this action',
          status: 'error'
        });
      case 500:
        return Promise.reject({
          message: 'Server error. Please try again later.',
          status: 'error'
        });
    }

    return Promise.reject({
      message: errorMessage,
      status: 'error'
    });
  }
);

export default api; 
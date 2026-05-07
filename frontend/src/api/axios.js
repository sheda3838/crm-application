import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Request Interceptor: Attach Token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Use window.location.href for a hard redirect on auth failure
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

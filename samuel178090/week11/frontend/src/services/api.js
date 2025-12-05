import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://payverse-backend.onrender.com';
const API_BASE_URL = `${API_BASE.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor to attempt refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        isRefreshing = false;
        return Promise.reject(err);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (e) {
        processQueue(e, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  validateToken: () => api.get('/auth/validate'),
  refresh: (payload) => api.post('/auth/refresh', payload),
  logout: (payload) => api.post('/auth/logout', payload)
};

export const transactionAPI = {
  create: (transaction) => api.post('/transactions', transaction),
  getAll: () => api.get('/transactions'),
  getAllAdmin: () => api.get('/transactions/all'),
};

export const userAPI = {
  getAll: () => api.get('/users'),
};

export default api;
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const healthAPI = {
  getHealth: () => api.get('/health'),
  getDetailedHealth: () => api.get('/health/detailed'),
  getMetrics: () => api.get('/health/metrics'),
};

export const appAPI = {
  getStatus: () => api.get('/api/status'),
  getVersion: () => api.get('/api/version'),
  getInfo: () => api.get('/api/info'),
  getMetrics: () => api.get('/api/metrics'),
  getPipelines: () => api.get('/api/pipelines'),
  createPipeline: (data) => api.post('/api/pipelines', data),
  getLogs: () => api.get('/api/logs'),
  getAlerts: () => api.get('/api/alerts'),
  resolveAlert: (id) => api.patch(`/api/alerts/${id}`),
  getDeployments: () => api.get('/api/deployments'),
  createDeployment: (data) => api.post('/api/deployments', data),
  rollbackDeployment: (id) => api.post(`/api/deployments/${id}/rollback`),
  getWebhooks: () => api.get('/api/webhooks'),
  createWebhook: (data) => api.post('/api/webhooks', data),
  updateWebhook: (id, data) => api.put(`/api/webhooks/${id}`, data),
  deleteWebhook: (id) => api.delete(`/api/webhooks/${id}`),
  getSettings: () => api.get('/api/settings'),
  updateSettings: (data) => api.put('/api/settings', data),
};

export default api;
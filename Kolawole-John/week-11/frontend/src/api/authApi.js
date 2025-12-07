import axiosInstance from './axios';

export const authApi = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};
import axiosInstance from './axios';

export const transactionApi = {
  /**
   * Create a new transaction
   */
  create: async (transactionData) => {
    const response = await axiosInstance.post('/transactions', transactionData);
    return response.data;
  },

  /**
   * Get user's transaction history
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get('/transactions', { params });
    return response.data;
  },

  /**
   * Get specific transaction by ID
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`/transactions/${id}`);
    return response.data;
  },

  /**
   * Get user statistics
   */
  getStats: async () => {
    const response = await axiosInstance.get('/transactions/stats');
    return response.data;
  },
};
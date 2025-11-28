import axios from 'axios';
import { 
  ApiResponse, 
  ModernPayment, 
  ModernCustomer, 
  PaginatedResponse, 
  PaymentStats, 
  CustomerStats 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v2';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const paymentService = {
  async getPayments(page = 1, limit = 10, status?: string): Promise<PaginatedResponse<ModernPayment>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (status) params.append('status', status);
    
    const response = await api.get<ApiResponse<PaginatedResponse<ModernPayment>>>(`/payments?${params}`);
    return response.data.data!;
  },

  async getPaymentById(id: string): Promise<ModernPayment> {
    const response = await api.get<ApiResponse<ModernPayment>>(`/payments/${id}`);
    return response.data.data!;
  },

  async getPaymentStats(): Promise<PaymentStats> {
    const response = await api.get<ApiResponse<PaymentStats>>('/payments/stats');
    return response.data.data!;
  },
};

export const customerService = {
  async getCustomers(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<ModernCustomer>> {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append('search', search);
    
    const response = await api.get<ApiResponse<PaginatedResponse<ModernCustomer>>>(`/customers?${params}`);
    return response.data.data!;
  },

  async getCustomerById(id: string): Promise<ModernCustomer> {
    const response = await api.get<ApiResponse<ModernCustomer>>(`/customers/${id}`);
    return response.data.data!;
  },

  async getCustomerStats(): Promise<CustomerStats> {
    const response = await api.get<ApiResponse<CustomerStats>>('/customers/stats');
    return response.data.data!;
  },
};

export const healthService = {
  async getHealth() {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
import axios, { AxiosInstance } from 'axios';
import { Customer, Payment, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'api-version': 'v2',
      },
    });
  }

  async getCustomers(): Promise<Customer[]> {
    const response = await this.client.get<ApiResponse<Customer[]>>('/api/v2/customers');
    return response.data.data;
  }

  async getCustomerById(id: number): Promise<Customer> {
    const response = await this.client.get<ApiResponse<Customer>>(`/api/v2/customers/${id}`);
    return response.data.data;
  }

  async getPayments(status?: string): Promise<Payment[]> {
    const params = status ? { status } : {};
    const response = await this.client.get<ApiResponse<Payment[]>>('/api/v2/payments', { params });
    return response.data.data;
  }

  async getPaymentById(id: number): Promise<Payment> {
    const response = await this.client.get<ApiResponse<Payment>>(`/api/v2/payments/${id}`);
    return response.data.data;
  }

  async getCustomerPayments(customerId: number): Promise<Payment[]> {
    const response = await this.client.get<ApiResponse<Payment[]>>(
      `/api/v2/customers/${customerId}/payments`
    );
    return response.data.data;
  }
}

export const apiService = new ApiService();



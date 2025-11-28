import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { LegacyPayment, LegacyCustomer } from '../types';
import { retryService } from '../utils/retry';
import { cacheService } from '../utils/cache';

export class LegacyService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.legacyApiUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LegacyBridge/1.0',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`Making request to: ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`Response received from: ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('Response error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  async getPayments(): Promise<LegacyPayment[]> {
    const cacheKey = 'legacy_payments';
    const cached = cacheService.get<LegacyPayment[]>(cacheKey);
    
    if (cached) {
      console.log('Returning cached payments');
      return cached;
    }

    const payments = await retryService.executeWithRetry(async () => {
      const response = await this.client.get<LegacyPayment[]>('/posts');
      return response.data;
    });

    cacheService.set(cacheKey, payments, 300); // Cache for 5 minutes
    return payments;
  }

  async getPaymentById(id: number): Promise<LegacyPayment> {
    const cacheKey = `legacy_payment_${id}`;
    const cached = cacheService.get<LegacyPayment>(cacheKey);
    
    if (cached) {
      console.log(`Returning cached payment ${id}`);
      return cached;
    }

    const payment = await retryService.executeWithRetry(async () => {
      const response = await this.client.get<LegacyPayment>(`/posts/${id}`);
      return response.data;
    });

    cacheService.set(cacheKey, payment, 300);
    return payment;
  }

  async getCustomers(): Promise<LegacyCustomer[]> {
    const cacheKey = 'legacy_customers';
    const cached = cacheService.get<LegacyCustomer[]>(cacheKey);
    
    if (cached) {
      console.log('Returning cached customers');
      return cached;
    }

    const customers = await retryService.executeWithRetry(async () => {
      const response = await this.client.get<LegacyCustomer[]>('/users');
      return response.data;
    });

    cacheService.set(cacheKey, customers, 600); // Cache for 10 minutes
    return customers;
  }

  async getCustomerById(id: number): Promise<LegacyCustomer> {
    const cacheKey = `legacy_customer_${id}`;
    const cached = cacheService.get<LegacyCustomer>(cacheKey);
    
    if (cached) {
      console.log(`Returning cached customer ${id}`);
      return cached;
    }

    const customer = await retryService.executeWithRetry(async () => {
      const response = await this.client.get<LegacyCustomer>(`/users/${id}`);
      return response.data;
    });

    cacheService.set(cacheKey, customer, 600);
    return customer;
  }
}
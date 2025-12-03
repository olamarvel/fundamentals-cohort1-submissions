import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '../config/env';
import { cacheService } from './cache.service';
import { kenyanDataService } from './kenyan-data.service';

export interface LegacyUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export interface LegacyPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface LegacyPayment {
  id: number;
  userId: number;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  description: string;
}

class LegacyApiService {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.legacyApiBaseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.apiTimeoutMs,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number = config.maxRetries
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < retries) {
          const delay = config.retryDelayMs * Math.pow(2, attempt);
          await this.sleep(delay);
        }
      }
    }

    throw new Error(
      `Request failed after ${retries + 1} attempts: ${lastError?.message || 'Unknown error'}`
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `legacy:${endpoint}:${paramsStr}`;
  }

  async getUsers(): Promise<LegacyUser[]> {
    const cacheKey = this.getCacheKey('users');
    const cached = cacheService.get<LegacyUser[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const users = await this.retryRequest(async () => {
      const response = await this.client.get<LegacyUser[]>('/users');
      // Transform to Kenyan data
      return response.data.map((user) => kenyanDataService.transformToKenyanUser(user));
    });

    cacheService.set(cacheKey, users);
    return users;
  }

  async getUserById(id: number): Promise<LegacyUser> {
    const cacheKey = this.getCacheKey('user', { id });
    const cached = cacheService.get<LegacyUser>(cacheKey);
    if (cached) {
      return cached;
    }

    const user = await this.retryRequest(async () => {
      const response = await this.client.get<LegacyUser>(`/users/${id}`);
      // Transform to Kenyan data
      return kenyanDataService.transformToKenyanUser(response.data);
    });

    cacheService.set(cacheKey, user);
    return user;
  }

  async getPosts(): Promise<LegacyPost[]> {
    const cacheKey = this.getCacheKey('posts');
    const cached = cacheService.get<LegacyPost[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const posts = await this.retryRequest(async () => {
      const response = await this.client.get<LegacyPost[]>('/posts');
      return response.data;
    });

    cacheService.set(cacheKey, posts);
    return posts;
  }

  async getPostsByUserId(userId: number): Promise<LegacyPost[]> {
    const cacheKey = this.getCacheKey('posts', { userId });
    const cached = cacheService.get<LegacyPost[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const posts = await this.retryRequest(async () => {
      const response = await this.client.get<LegacyPost[]>(`/posts?userId=${userId}`);
      return response.data;
    });

    cacheService.set(cacheKey, posts);
    return posts;
  }

  async getMockPayments(): Promise<LegacyPayment[]> {
    const cacheKey = this.getCacheKey('payments');
    const cached = cacheService.get<LegacyPayment[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const users = await this.getUsers();
    const payments: LegacyPayment[] = users.slice(0, 10).map((user, index) => {
      const baseAmount = Math.floor(Math.random() * 100000) + 1000; // Amount in KES
      const basePayment: LegacyPayment = {
        id: index + 1,
        userId: user.id,
        amount: baseAmount,
        currency: 'KES',
        status: ['pending', 'completed', 'failed'][Math.floor(Math.random() * 3)],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: `Payment for ${user.name}`,
      };
      // Transform to Kenyan payment format (keeps amount as is, just updates description)
      return kenyanDataService.transformToKenyanPayment(basePayment, user.name);
    });

    cacheService.set(cacheKey, payments);
    return payments;
  }
}

export const legacyApiService = new LegacyApiService();



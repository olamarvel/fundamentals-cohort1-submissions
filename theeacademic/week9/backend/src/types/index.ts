export interface LegacyPayment {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface ModernPayment {
  paymentId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface LegacyCustomer {
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

export interface ModernCustomer {
  customerId: string;
  fullName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
  company?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastUpdated: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  version: string;
}

export interface CacheConfig {
  ttl: number;
  checkperiod: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}
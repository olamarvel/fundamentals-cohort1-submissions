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

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaymentStats {
  total: number;
  byStatus: {
    pending: number;
    completed: number;
    failed: number;
  };
  totalAmount: number;
  averageAmount: number;
}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  withCompany: number;
  topCities: Array<{ city: string; count: number }>;
}
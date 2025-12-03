export interface Customer {
  id: number;
  fullName: string;
  email: string;
  contactInfo: {
    phone: string;
    address: string;
  };
  company: string;
  registrationDate: string;
  status: 'active' | 'inactive';
}

export interface Payment {
  id: number;
  customerId: number;
  customerName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionDate: string;
  description: string;
  metadata: {
    originalId: number;
    processedAt: string;
  };
}

export interface ApiResponse<T> {
  version: string;
  data: T;
  count?: number;
  timestamp: string;
}



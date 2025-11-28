import { LegacyPayment, ModernPayment, LegacyCustomer, ModernCustomer } from '../types';

export class DataTransformer {
  static transformPayment(legacyPayment: LegacyPayment): ModernPayment {
    const now = new Date().toISOString();
    
    return {
      paymentId: `PAY_${legacyPayment.id.toString().padStart(6, '0')}`,
      customerId: `CUST_${legacyPayment.userId.toString().padStart(6, '0')}`,
      amount: Math.floor(Math.random() * 10000) + 100, // Mock amount
      currency: 'USD',
      status: DataTransformer.getRandomStatus(),
      description: legacyPayment.title,
      createdAt: now,
      updatedAt: now,
    };
  }

  static transformCustomer(legacyCustomer: LegacyCustomer): ModernCustomer {
    const now = new Date().toISOString();
    
    return {
      customerId: `CUST_${legacyCustomer.id.toString().padStart(6, '0')}`,
      fullName: legacyCustomer.name,
      email: legacyCustomer.email,
      phone: legacyCustomer.phone,
      address: {
        street: `${legacyCustomer.address.street} ${legacyCustomer.address.suite}`,
        city: legacyCustomer.address.city,
        zipcode: legacyCustomer.address.zipcode,
      },
      company: legacyCustomer.company.name,
      status: 'active',
      createdAt: now,
      lastUpdated: now,
    };
  }

  private static getRandomStatus(): 'pending' | 'completed' | 'failed' {
    const statuses: ('pending' | 'completed' | 'failed')[] = ['pending', 'completed', 'failed'];
    const weights = [0.2, 0.7, 0.1]; // 20% pending, 70% completed, 10% failed
    
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (random <= sum) {
        return statuses[i];
      }
    }
    
    return 'completed';
  }
}
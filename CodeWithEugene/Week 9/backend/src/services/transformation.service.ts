import { LegacyUser, LegacyPost, LegacyPayment } from './legacy-api.service';

export interface TransformedCustomer {
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

export interface TransformedPayment {
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

export class TransformationService {
  transformUserToCustomer(user: LegacyUser): TransformedCustomer {
    // Format Kenyan phone number for display
    const formattedPhone = user.phone.length === 10 
      ? `${user.phone.slice(0, 4)} ${user.phone.slice(4, 7)} ${user.phone.slice(7)}`
      : user.phone;

    return {
      id: user.id,
      fullName: user.name,
      email: user.email,
      contactInfo: {
        phone: formattedPhone,
        address: `${user.address.street}, ${user.address.city}, Kenya ${user.address.zipcode}`,
      },
      company: user.company.name,
      registrationDate: new Date().toISOString(),
      status: 'active',
    };
  }

  transformUsersToCustomers(users: LegacyUser[]): TransformedCustomer[] {
    return users.map((user) => this.transformUserToCustomer(user));
  }

  transformPayment(
    payment: LegacyPayment,
    customerName: string
  ): TransformedPayment {
    return {
      id: payment.id,
      customerId: payment.userId,
      customerName,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status as 'pending' | 'completed' | 'failed',
      transactionDate: payment.createdAt,
      description: payment.description,
      metadata: {
        originalId: payment.id,
        processedAt: new Date().toISOString(),
      },
    };
  }

  transformPayments(
    payments: LegacyPayment[],
    customers: Map<number, string>
  ): TransformedPayment[] {
    return payments.map((payment) => {
      const customerName = customers.get(payment.userId) || 'Unknown Customer';
      return this.transformPayment(payment, customerName);
    });
  }

  enrichCustomerWithPosts(
    customer: TransformedCustomer,
    posts: LegacyPost[]
  ): TransformedCustomer & { activityCount: number } {
    const userPosts = posts.filter((post) => {
      const userId = parseInt(post.userId.toString(), 10);
      return userId === customer.id;
    });

    return {
      ...customer,
      activityCount: userPosts.length,
    };
  }
}

export const transformationService = new TransformationService();



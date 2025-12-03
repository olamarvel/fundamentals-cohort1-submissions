import { transformationService } from '../src/services/transformation.service';
import { LegacyUser, LegacyPost, LegacyPayment } from '../src/services/legacy-api.service';

describe('TransformationService', () => {
  const mockUser: LegacyUser = {
    id: 1,
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    address: {
      street: '123 Main St',
      suite: 'Apt 4',
      city: 'New York',
      zipcode: '10001',
      geo: {
        lat: '40.7128',
        lng: '-74.0060',
      },
    },
    phone: '555-1234',
    website: 'johndoe.com',
    company: {
      name: 'Acme Corp',
      catchPhrase: 'Making things happen',
      bs: 'synergize',
    },
  };

  const mockPayment: LegacyPayment = {
    id: 1,
    userId: 1,
    amount: 1000,
    currency: 'USD',
    status: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    description: 'Test payment',
  };

  describe('transformUserToCustomer', () => {
    it('should transform a legacy user to a customer', () => {
      const result = transformationService.transformUserToCustomer(mockUser);

      expect(result).toEqual({
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        contactInfo: {
          phone: '555-1234',
          address: '123 Main St, New York, 10001',
        },
        company: 'Acme Corp',
        registrationDate: expect.any(String),
        status: 'active',
      });
    });
  });

  describe('transformUsersToCustomers', () => {
    it('should transform multiple users to customers', () => {
      const users = [mockUser, { ...mockUser, id: 2, name: 'Jane Doe' }];
      const result = transformationService.transformUsersToCustomers(users);

      expect(result).toHaveLength(2);
      expect(result[0].fullName).toBe('John Doe');
      expect(result[1].fullName).toBe('Jane Doe');
    });
  });

  describe('transformPayment', () => {
    it('should transform a legacy payment to a modern payment', () => {
      const result = transformationService.transformPayment(mockPayment, 'John Doe');

      expect(result).toEqual({
        id: 1,
        customerId: 1,
        customerName: 'John Doe',
        amount: 1000,
        currency: 'USD',
        status: 'completed',
        transactionDate: '2024-01-01T00:00:00Z',
        description: 'Test payment',
        metadata: {
          originalId: 1,
          processedAt: expect.any(String),
        },
      });
    });
  });

  describe('transformPayments', () => {
    it('should transform multiple payments', () => {
      const payments = [mockPayment, { ...mockPayment, id: 2, userId: 2 }];
      const customerMap = new Map([
        [1, 'John Doe'],
        [2, 'Jane Doe'],
      ]);

      const result = transformationService.transformPayments(payments, customerMap);

      expect(result).toHaveLength(2);
      expect(result[0].customerName).toBe('John Doe');
      expect(result[1].customerName).toBe('Jane Doe');
    });
  });

  describe('enrichCustomerWithPosts', () => {
    it('should enrich customer with post count', () => {
      const customer = transformationService.transformUserToCustomer(mockUser);
      const posts: LegacyPost[] = [
        { userId: 1, id: 1, title: 'Post 1', body: 'Body 1' },
        { userId: 1, id: 2, title: 'Post 2', body: 'Body 2' },
        { userId: 2, id: 3, title: 'Post 3', body: 'Body 3' },
      ];

      const result = transformationService.enrichCustomerWithPosts(customer, posts);

      expect(result.activityCount).toBe(2);
      expect(result.id).toBe(customer.id);
    });
  });
});



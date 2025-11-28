import { DataTransformer } from '../../src/utils/transformer';
import { LegacyPayment, LegacyCustomer } from '../../src/types';

describe('DataTransformer', () => {
  describe('transformPayment', () => {
    it('should transform legacy payment to modern payment', () => {
      const legacyPayment: LegacyPayment = {
        id: 1,
        userId: 123,
        title: 'Test Payment',
        body: 'Payment description',
      };

      const modernPayment = DataTransformer.transformPayment(legacyPayment);

      expect(modernPayment.paymentId).toBe('PAY_000001');
      expect(modernPayment.customerId).toBe('CUST_000123');
      expect(modernPayment.description).toBe('Test Payment');
      expect(modernPayment.currency).toBe('USD');
      expect(['pending', 'completed', 'failed']).toContain(modernPayment.status);
      expect(modernPayment.amount).toBeGreaterThan(0);
    });
  });

  describe('transformCustomer', () => {
    it('should transform legacy customer to modern customer', () => {
      const legacyCustomer: LegacyCustomer = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        address: {
          street: '123 Main St',
          suite: 'Apt 1',
          city: 'New York',
          zipcode: '10001',
          geo: { lat: '40.7128', lng: '-74.0060' },
        },
        phone: '555-1234',
        website: 'johndoe.com',
        company: {
          name: 'Acme Corp',
          catchPhrase: 'Innovation at its best',
          bs: 'synergistic solutions',
        },
      };

      const modernCustomer = DataTransformer.transformCustomer(legacyCustomer);

      expect(modernCustomer.customerId).toBe('CUST_000001');
      expect(modernCustomer.fullName).toBe('John Doe');
      expect(modernCustomer.email).toBe('john@example.com');
      expect(modernCustomer.phone).toBe('555-1234');
      expect(modernCustomer.address.street).toBe('123 Main St Apt 1');
      expect(modernCustomer.address.city).toBe('New York');
      expect(modernCustomer.company).toBe('Acme Corp');
      expect(modernCustomer.status).toBe('active');
    });
  });
});
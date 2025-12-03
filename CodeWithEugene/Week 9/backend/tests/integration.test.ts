import request from 'supertest';
import app from '../src/server';

describe('API Integration Tests', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('service', 'legacybridge-backend');
    });
  });

  describe('GET /api/v2/customers', () => {
    it('should return transformed customers', async () => {
      const response = await request(app).get('/api/v2/customers');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('version', 'v2');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      if (response.body.data.length > 0) {
        expect(response.body.data[0]).toHaveProperty('fullName');
        expect(response.body.data[0]).toHaveProperty('email');
        expect(response.body.data[0]).toHaveProperty('contactInfo');
      }
    });
  });

  describe('GET /api/v2/customers/:id', () => {
    it('should return a single customer', async () => {
      const response = await request(app).get('/api/v2/customers/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('version', 'v2');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1);
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app).get('/api/v2/customers/invalid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/v2/payments', () => {
    it('should return transformed payments', async () => {
      const response = await request(app).get('/api/v2/payments');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('version', 'v2');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter payments by status', async () => {
      const response = await request(app).get('/api/v2/payments?status=completed');

      expect(response.status).toBe(200);
      if (response.body.data.length > 0) {
        response.body.data.forEach((payment: any) => {
          expect(payment.status).toBe('completed');
        });
      }
    });
  });

  describe('API Versioning', () => {
    it('should accept version via header', async () => {
      const response = await request(app)
        .get('/api/v2/customers')
        .set('api-version', 'v2');

      expect(response.status).toBe(200);
    });

    it('should reject unsupported versions', async () => {
      const response = await request(app)
        .get('/api/v2/customers')
        .set('api-version', 'v3');

      expect(response.status).toBe(400);
      expect(response.body.error).toHaveProperty('code', 'Unsupported API version');
    });
  });
});



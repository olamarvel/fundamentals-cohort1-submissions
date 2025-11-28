import request from 'supertest';
import app from '../../src/app';

describe('Payment Controller', () => {
  describe('GET /api/v2/payments', () => {
    it('should return paginated payments', async () => {
      const response = await request(app)
        .get('/api/v2/payments')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.payments).toBeInstanceOf(Array);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.version).toBe('v2');
    });

    it('should filter payments by status', async () => {
      const response = await request(app)
        .get('/api/v2/payments?status=completed')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.payments.forEach((payment: any) => {
        expect(payment.status).toBe('completed');
      });
    });

    it('should handle pagination parameters', async () => {
      const response = await request(app)
        .get('/api/v2/payments?page=1&limit=5')
        .expect(200);

      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
      expect(response.body.data.payments.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /api/v2/payments/:id', () => {
    it('should return a specific payment', async () => {
      const response = await request(app)
        .get('/api/v2/payments/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentId).toBe('PAY_000001');
    });

    it('should return 400 for invalid ID', async () => {
      const response = await request(app)
        .get('/api/v2/payments/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid ID');
    });
  });

  describe('GET /api/v2/payments/stats', () => {
    it('should return payment statistics', async () => {
      const response = await request(app)
        .get('/api/v2/payments/stats')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBeGreaterThan(0);
      expect(response.body.data.byStatus).toBeDefined();
      expect(response.body.data.totalAmount).toBeGreaterThan(0);
    });
  });
});
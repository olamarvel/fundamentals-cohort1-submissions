const request = require('supertest');
const app = require('../app');

describe('Health Endpoints', () => {
  test('GET /health should return OK status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });

  test('GET /health/detailed should return detailed info', async () => {
    const response = await request(app)
      .get('/health/detailed')
      .expect(200);
    
    expect(response.body).toHaveProperty('memory');
    expect(response.body).toHaveProperty('environment');
  });

  test('GET /health/ready should return ready status', async () => {
    const response = await request(app)
      .get('/health/ready')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'Ready');
  });

  test('GET /health/metrics should return prometheus metrics', async () => {
    const response = await request(app)
      .get('/health/metrics')
      .expect(200);
    
    expect(response.text).toContain('# HELP');
  });
});
const request = require('supertest');
const app = require('../app');

describe('API Endpoints', () => {
  test('GET /api/status should return service status', async () => {
    const response = await request(app)
      .get('/api/status')
      .expect(200);
    
    expect(response.body).toHaveProperty('service', 'DeployHub Backend');
    expect(response.body).toHaveProperty('status', 'running');
  });

  test('GET /api/version should return version info', async () => {
    const response = await request(app)
      .get('/api/version')
      .expect(200);
    
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('nodeVersion');
  });

  test('GET /api/error should return 500 error', async () => {
    const response = await request(app)
      .get('/api/error')
      .expect(500);
    
    expect(response.body).toHaveProperty('error');
  });

  test('GET / should return API info', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body).toHaveProperty('message', 'DeployHub Backend API');
    expect(response.body).toHaveProperty('endpoints');
  });
});
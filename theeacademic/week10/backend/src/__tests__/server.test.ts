import request from 'supertest';
import app from '../server';

describe('SyncForge Backend API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('GET /api/projects', () => {
    it('should return all projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should filter projects by status', async () => {
      const response = await request(app)
        .get('/api/projects?status=active')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((project: any) => {
        expect(project.status).toBe('active');
      });
    });
  });

  describe('GET /api/teams/members', () => {
    it('should return all team members', async () => {
      const response = await request(app)
        .get('/api/teams/members')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const newProject = {
        name: 'Test Project',
        description: 'A test project for unit testing',
        teamMembers: ['1', '2']
      };

      const response = await request(app)
        .post('/api/projects')
        .send(newProject)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(newProject.name);
      expect(response.body.data.description).toBe(newProject.description);
      expect(response.body.data.status).toBe('active');
    });

    it('should validate required fields', async () => {
      const invalidProject = {
        name: '', // Invalid: empty name
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/projects')
        .send(invalidProject)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});
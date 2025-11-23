require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/logger');
const monitoringMiddleware = require('./middleware/monitoring');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000 // limit each IP to 1000 requests per minute
});
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Monitoring middleware
app.use(monitoringMiddleware);

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'DeployHub Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      metrics: '/health/metrics',
      info: '/api/info',
      status: '/api/status'
    }
  });
});

// Deployment info endpoint
app.get('/api/info', (req, res) => {
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  res.json({
    service: 'DeployHub Backend',
    version: process.env.VERSION || '1.0.0',
    deployedAt: process.env.DEPLOYED_AT || new Date().toISOString(),
    commitSha: process.env.COMMIT_SHA || 'unknown',
    environment: process.env.NODE_ENV || 'development',
    buildNumber: process.env.BUILD_NUMBER || '0',
    uptime: `${hours}h ${minutes}m`,
    uptimeSeconds: uptime,
    nodeVersion: process.version,
    buildTime: new Date().toLocaleDateString(),
    lastCheck: new Date().toLocaleTimeString()
  });
});

// System metrics endpoint
app.get('/api/metrics', (req, res) => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  res.json({
    memory: {
      total: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
      heap: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)} MB`
    },
    uptime: {
      seconds: uptime,
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
    },
    version: {
      app: '1.0.0',
      node: process.version,
      platform: process.platform
    },
    timestamp: new Date().toISOString()
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    timestamp: new Date().toISOString(),
    services: {
      database: 'healthy',
      cache: 'healthy',
      external_apis: 'healthy'
    }
  });
});

// Pipelines endpoints
app.get('/api/pipelines', (req, res) => {
  res.json([
    { id: 1, name: 'Production Deploy', status: 'success', lastRun: '2 hours ago' },
    { id: 2, name: 'Staging Deploy', status: 'running', lastRun: 'now' },
    { id: 3, name: 'Feature Branch', status: 'failed', lastRun: '1 day ago' }
  ]);
});

app.post('/api/pipelines', (req, res) => {
  res.json({ id: Date.now(), message: 'Pipeline created successfully' });
});

// Logs endpoint
app.get('/api/logs', (req, res) => {
  res.json([
    { id: 1, timestamp: new Date().toISOString(), level: 'info', service: 'api', message: 'Server started successfully' },
    { id: 2, timestamp: new Date().toISOString(), level: 'info', service: 'auth', message: 'Authentication service initialized' },
    { id: 3, timestamp: new Date().toISOString(), level: 'warning', service: 'monitoring', message: 'High memory usage detected' },
    { id: 4, timestamp: new Date().toISOString(), level: 'error', service: 'deployment', message: 'Deployment validation failed' }
  ]);
});

// Webhooks endpoint
app.get('/api/webhooks', (req, res) => {
  res.json([
    { id: 1, name: 'GitHub Deploy', url: 'https://api.github.com/webhook', active: true },
    { id: 2, name: 'Slack Notify', url: 'https://hooks.slack.com/webhook', active: false }
  ]);
});

// API Keys endpoint
app.get('/api/keys', (req, res) => {
  res.json([
    { id: 1, name: 'Production Key', key: 'pk_***************', created: '2024-01-01' },
    { id: 2, name: 'Development Key', key: 'dk_***************', created: '2024-01-15' }
  ]);
});

// Alerts endpoint
app.get('/api/alerts', (req, res) => {
  res.json([
    { id: 1, type: 'error', title: 'Deployment Failed', message: 'Production deployment failed due to test failures', time: '5 minutes ago', resolved: false },
    { id: 2, type: 'warning', title: 'High CPU Usage', message: 'CPU usage above 80% for 10 minutes', time: '15 minutes ago', resolved: false },
    { id: 3, type: 'info', title: 'Deployment Success', message: 'Staging deployment completed successfully', time: '1 hour ago', resolved: true }
  ]);
});

app.patch('/api/alerts/:id', (req, res) => {
  res.json({ message: 'Alert resolved successfully' });
});

// Builds endpoint
app.get('/api/builds', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Frontend Build',
      status: 'success',
      duration: '2m 30s',
      tests: { passed: 45, failed: 0, total: 45 },
      coverage: '92%',
      branch: 'main',
      commit: 'abc123f'
    },
    {
      id: 2,
      name: 'Backend Build',
      status: 'running',
      duration: '1m 15s',
      tests: { passed: 32, failed: 2, total: 34 },
      coverage: '88%',
      branch: 'develop',
      commit: 'def456a'
    }
  ]);
});

app.post('/api/builds/:id/run', (req, res) => {
  res.json({ message: 'Build started successfully' });
});

// Deployments endpoint
app.get('/api/deployments', (req, res) => {
  res.json([
    {
      id: 1,
      environment: 'Production',
      status: 'success',
      version: 'v1.2.3',
      deployedAt: '2024-01-15 14:30:00',
      deployedBy: 'john.doe',
      duration: '3m 45s',
      health: 'healthy'
    },
    {
      id: 2,
      environment: 'Staging',
      status: 'running',
      version: 'v1.2.4-beta',
      deployedAt: '2024-01-15 15:00:00',
      deployedBy: 'jane.smith',
      duration: '1m 20s',
      health: 'deploying'
    }
  ]);
});

app.post('/api/deployments', (req, res) => {
  const { environment } = req.body;
  res.json({ 
    id: Date.now(), 
    message: `Deployment to ${environment} started successfully` 
  });
});

app.post('/api/deployments/:id/rollback', (req, res) => {
  res.json({ message: 'Rollback initiated successfully' });
});

// Settings endpoint
app.get('/api/settings', (req, res) => {
  res.json({
    notifications: {
      email: true,
      slack: false,
      webhook: true
    },
    deployment: {
      autoRollback: true,
      healthCheckTimeout: 300,
      approvalRequired: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 3600,
      apiKeyExpiry: 90
    }
  });
});

app.put('/api/settings', (req, res) => {
  res.json({ message: 'Settings saved successfully' });
});

// Webhooks CRUD
app.post('/api/webhooks', (req, res) => {
  res.json({ id: Date.now(), message: 'Webhook created successfully' });
});

app.put('/api/webhooks/:id', (req, res) => {
  res.json({ message: 'Webhook updated successfully' });
});

app.delete('/api/webhooks/:id', (req, res) => {
  res.json({ message: 'Webhook deleted successfully' });
});

// Docker endpoint
app.get('/api/docker', (req, res) => {
  res.json([
    { id: 1, name: 'deployhub-backend', tag: 'latest', size: '245MB', created: '2 hours ago' },
    { id: 2, name: 'deployhub-frontend', tag: 'v1.2.3', size: '180MB', created: '1 day ago' }
  ]);
});

app.post('/api/docker/build', (req, res) => {
  res.json({ message: 'Docker build started successfully' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, {
      port: PORT,
      environment: process.env.NODE_ENV || 'development'
    });
  });
}

module.exports = app;
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/logger');
const monitoringMiddleware = require('./middleware/monitoring');
const errorHandler = require('./middleware/errorHandler');
const healthRoutes = require('./routes/health');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
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
  res.json({
    service: 'DeployHub Backend',
    version: process.env.VERSION || '1.0.0',
    deployedAt: process.env.DEPLOYED_AT || new Date().toISOString(),
    commitSha: process.env.COMMIT_SHA || 'unknown',
    environment: process.env.NODE_ENV || 'development',
    buildNumber: process.env.BUILD_NUMBER || '0',
    uptime: process.uptime()
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
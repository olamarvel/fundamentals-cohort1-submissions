const client = require('prom-client');

// Create a Registry
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Deployment metrics
const deploymentCounter = new client.Counter({
  name: 'deployments_total',
  help: 'Total number of deployments',
  labelNames: ['environment', 'status', 'version']
});

const deploymentDuration = new client.Histogram({
  name: 'deployment_duration_seconds',
  help: 'Duration of deployments in seconds',
  labelNames: ['environment', 'status'],
  buckets: [30, 60, 120, 300, 600, 1200]
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(activeConnections);
register.registerMetric(deploymentCounter);
register.registerMetric(deploymentDuration);

// Track successful deployment on startup
if (process.env.NODE_ENV === 'production') {
  deploymentCounter.labels('production', 'success', process.env.VERSION || '1.0.0').inc();
}

module.exports = {
  register,
  httpRequestDuration,
  httpRequestsTotal,
  activeConnections,
  deploymentCounter,
  deploymentDuration
};
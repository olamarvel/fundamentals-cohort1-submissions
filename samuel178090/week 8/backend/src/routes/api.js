const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

// Sample API endpoints
router.get('/status', (req, res) => {
  logger.info('Status endpoint accessed');
  res.json({
    service: 'DeployHub Backend',
    status: 'running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

router.get('/version', (req, res) => {
  res.json({
    version: process.env.npm_package_version || '1.0.0',
    buildTime: new Date().toISOString(),
    nodeVersion: process.version
  });
});

// Simulate error for testing
router.get('/error', (req, res, next) => {
  const error = new Error('Simulated error for testing');
  error.statusCode = 500;
  next(error);
});

// Deployment endpoints
let deployments = [
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
];

router.get('/deployments', (req, res) => {
  logger.info('Deployments endpoint accessed');
  res.json(deployments);
});

router.post('/deployments', (req, res) => {
  const { environment } = req.body;
  const newDeployment = {
    id: Date.now(),
    environment,
    status: 'running',
    version: `v1.2.${deployments.length + 3}`,
    deployedAt: new Date().toLocaleString(),
    deployedBy: 'current.user',
    duration: '0s',
    health: 'deploying'
  };
  deployments.unshift(newDeployment);
  logger.info(`New deployment created for ${environment}`);
  res.json(newDeployment);
});

router.post('/deployments/:id/rollback', (req, res) => {
  const id = parseInt(req.params.id);
  const deployment = deployments.find(d => d.id === id);
  if (deployment) {
    deployment.status = 'running';
    deployment.health = 'deploying';
    logger.info(`Rollback initiated for deployment ${id}`);
    res.json(deployment);
  } else {
    res.status(404).json({ error: 'Deployment not found' });
  }
});

// Documentation endpoints
router.get('/docs/sections', (req, res) => {
  const sections = [
    {
      title: 'Getting Started',
      icon: '🚀',
      description: 'Quick start guide to set up your first pipeline',
      items: [
        'Installation & Setup',
        'Creating Your First Pipeline', 
        'Connecting to GitHub',
        'Basic Configuration'
      ]
    },
    {
      title: 'API Reference',
      icon: '📡',
      description: 'Complete API documentation and endpoints',
      items: [
        'Authentication',
        'Health Endpoints',
        'Metrics API',
        'Pipeline Management'
      ]
    },
    {
      title: 'Best Practices',
      icon: '💡',
      description: 'Recommended patterns and configurations',
      items: [
        'Pipeline Design',
        'Security Guidelines',
        'Performance Optimization',
        'Error Handling'
      ]
    },
    {
      title: 'Troubleshooting',
      icon: '🔧',
      description: 'Common issues and solutions',
      items: [
        'Connection Problems',
        'Build Failures',
        'Deployment Issues',
        'Monitoring Alerts'
      ]
    }
  ];
  res.json(sections);
});

router.get('/docs/links', (req, res) => {
  const links = [
    { title: 'GitHub Repository', url: 'https://github.com', icon: '🐙' },
    { title: 'API Swagger Docs', url: 'http://localhost:5001/api/status', icon: '📋' },
    { title: 'Community Forum', url: 'https://stackoverflow.com', icon: '💬' },
    { title: 'Support Tickets', url: 'mailto:support@deployhub.com', icon: '🎫' }
  ];
  res.json(links);
});

module.exports = router;
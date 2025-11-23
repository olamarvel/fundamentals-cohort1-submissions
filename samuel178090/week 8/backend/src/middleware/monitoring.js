const logger = require('../utils/logger');
const { httpRequestDuration, httpRequestsTotal } = require('../utils/metrics');

const monitoringMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('Request received', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Override res.end to capture metrics
  const originalEnd = res.end;
  res.end = function(...args) {
    const duration = (Date.now() - start) / 1000;
    
    // Record metrics
    httpRequestDuration
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, req.route?.path || req.url, res.statusCode)
      .inc();

    // Log response
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}s`
    });

    originalEnd.apply(this, args);
  };

  next();
};

module.exports = monitoringMiddleware;
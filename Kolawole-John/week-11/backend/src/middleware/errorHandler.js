const ResponseHelper = require('../utils/responseHelper');

/**
 * Global error handler
 * Catches all errors thrown in the application
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // PostgreSQL errors
  if (err.code === '23505') {
    // Unique constraint violation (e.g., duplicate email)
    return ResponseHelper.error(res, 'Resource already exists', 409);
  }

  if (err.code === '23503') {
    // Foreign key violation
    return ResponseHelper.error(res, 'Referenced resource not found', 400);
  }

  // JWT errors (if not caught by middleware)
  if (err.name === 'JsonWebTokenError') {
    return ResponseHelper.error(res, 'Invalid token', 403);
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseHelper.error(res, 'Token expired', 401);
  }

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  return ResponseHelper.error(res, message, statusCode);
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res) => {
  return ResponseHelper.error(res, 'Endpoint not found', 404);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
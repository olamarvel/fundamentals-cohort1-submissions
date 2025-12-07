const jwt = require('jsonwebtoken');
const ResponseHelper = require('../utils/responseHelper');
const jwtConfig = require('../config/jwt');

/**
 * Middleware to verify JWT access token
 * Extracts user ID and attaches to req.user
 */
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return ResponseHelper.error(res, 'Access token required', 401);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtConfig.accessSecret);
    
    // Attach user data to request object
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next(); // Proceed to next middleware/controller
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return ResponseHelper.error(res, 'Access token expired', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return ResponseHelper.error(res, 'Invalid access token', 403);
    }
    return ResponseHelper.error(res, 'Authentication failed', 403);
  }
};

/**
 * Optional middleware: Verify refresh token
 */
const authenticateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return ResponseHelper.error(res, 'Refresh token required', 401);
  }

  try {
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
    req.user = {
      id: decoded.id,
      email: decoded.email
    };
    next();
  } catch (error) {
    return ResponseHelper.error(res, 'Invalid refresh token', 403);
  }
};

module.exports = {
  authenticateToken,
  authenticateRefreshToken
};
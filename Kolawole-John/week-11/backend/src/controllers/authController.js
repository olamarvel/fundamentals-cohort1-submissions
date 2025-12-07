const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ResponseHelper = require('../utils/responseHelper');
const jwtConfig = require('../config/jwt');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { email, password, full_name } = req.body;

      // Check if user already exists
      const existingUser = await User.emailExists(email);
      if (existingUser) {
        return ResponseHelper.error(res, 'Email already registered', 409);
      }

      // Create user
      const user = await User.create({ email, password, full_name });

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.accessSecret,
        { expiresIn: jwtConfig.accessExpiry }
      );

      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.refreshSecret,
        { expiresIn: jwtConfig.refreshExpiry }
      );

      return ResponseHelper.success(res, {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name
        },
        accessToken,
        refreshToken
      }, 'Registration successful', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return ResponseHelper.error(res, 'Invalid credentials', 401);
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return ResponseHelper.error(res, 'Invalid credentials', 401);
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.accessSecret,
        { expiresIn: jwtConfig.accessExpiry }
      );

      const refreshToken = jwt.sign(
        { id: user.id, email: user.email },
        jwtConfig.refreshSecret,
        { expiresIn: jwtConfig.refreshExpiry }
      );

      return ResponseHelper.success(res, {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name
        },
        accessToken,
        refreshToken
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static async refreshToken(req, res, next) {
    try {
      // User is already attached by authenticateRefreshToken middleware
      const { id, email } = req.user;

      // Generate new access token
      const accessToken = jwt.sign(
        { id, email },
        jwtConfig.accessSecret,
        { expiresIn: jwtConfig.accessExpiry }
      );

      return ResponseHelper.success(res, {
        accessToken
      }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return ResponseHelper.error(res, 'User not found', 404);
      }

      return ResponseHelper.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout (client-side token deletion)
   * POST /api/auth/logout
   * Note: With JWT, true logout requires token blacklisting (Redis)
   * For this challenge, we'll keep it simple (client deletes tokens)
   */
  static async logout(req, res, next) {
    try {
      // In production, add refresh token to Redis blacklist here
      return ResponseHelper.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
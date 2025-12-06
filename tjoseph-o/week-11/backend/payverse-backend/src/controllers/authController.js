const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { registerSchema, loginSchema } = require('../validators/schemas');

class AuthController {
  // Register new user
  async register(req, res, next) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(d => d.message)
        });
      }

      const { email, password, firstName, lastName, role } = value;

      // Check if user exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role: role || 'user'
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(d => d.message)
        });
      }

      const { email, password } = value;

      // Find user
      const user = await User.findOne({ 
        where: { email },
        attributes: { include: ['password'] }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check account status
      if (user.accountStatus !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Account is not active'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

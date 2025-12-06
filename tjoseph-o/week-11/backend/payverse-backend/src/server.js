require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./database/connection');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API Routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Failed to connect to database. Server not started.');
      process.exit(1);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 PayVerse API Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log(`\n📚 Available Endpoints:`);
      console.log(`   GET  /api/health`);
      console.log(`   POST /api/auth/register`);
      console.log(`   POST /api/auth/login`);
      console.log(`   GET  /api/auth/profile`);
      console.log(`   POST /api/transactions`);
      console.log(`   POST /api/transactions/deposit`);
      console.log(`   GET  /api/transactions`);
      console.log(`   GET  /api/transactions/:id`);
      console.log(`\n✨ Technical Trade-Offs Implemented:`);
      console.log(`   🗄️  SQL (PostgreSQL) - ACID compliance for financial transactions`);
      console.log(`   🔌 REST API - Wide compatibility and simplicity`);
      console.log(`   🔑 JWT Authentication - Stateless and scalable\n`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Import middleware
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// ==================== SECURITY MIDDLEWARE ====================
// Helmet: Sets security-related HTTP headers
app.use(helmet());

// CORS: Allow frontend to make requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==================== PERFORMANCE MIDDLEWARE ====================
// Compression: Compress response bodies
app.use(compression());

// ==================== LOGGING MIDDLEWARE ====================
// Morgan: HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ==================== BODY PARSERS ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== HEALTH CHECK ====================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'PayVerse API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// ==================== ERROR HANDLING ====================
// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Test database connection before starting server
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  console.log('✅ Database connected successfully');
  console.log(`📅 Server time: ${res.rows[0].now}`);

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 PayVerse backend running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('🔌 Database pool closed');
    process.exit(0);
  });
});
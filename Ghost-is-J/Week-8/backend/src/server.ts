import app from './app.js';
import logger from './logger.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`DeployHub backend running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('Graceful shutdown...');
  server.close(() => process.exit(0));
});

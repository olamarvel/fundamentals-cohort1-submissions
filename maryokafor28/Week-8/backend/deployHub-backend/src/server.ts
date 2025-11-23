import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const PORT = env.port;

// Start the server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} (${env.nodeEnv})`);
});

// Graceful shutdown handling
const shutdown = (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info("Server closed.");
    process.exit(0);
  });

  // Force exit if shutdown takes too long
  setTimeout(() => {
    logger.error("Forcing shutdown after timeout.");
    process.exit(1);
  }, 10000);
};

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});

// Handle uncaught exceptions & rejections
process.on("uncaughtException", (err) => {
  logger.error({ err }, "Uncaught Exception");
  shutdown("uncaughtException");
});

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled Promise Rejection");
  shutdown("unhandledRejection");
});

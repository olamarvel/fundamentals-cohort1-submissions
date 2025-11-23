import pino from "pino";
import { env } from "./env";

const isDev = env.isDevelopment;

// Create a single reusable logger instance
export const logger = pino({
  level: env.logLevel, // from LOG_LEVEL in .env
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined, // production logs stay in JSON format
  base: {
    app: env.app.name,
    version: env.app.version,
    env: env.nodeEnv,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { env, logEnvConfig } from "./config/env";
import { logger } from "./config/logger";
import { requestLogger } from "./middlewares/requestLogger";
import healthRoutes from "./routes/healthRoute";
import metricsRoutes from "./routes/metricsRoutes";
import { trackMetrics } from "./config/metrics";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

// Security and core middlewares
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local Vite dev
      "https://deployhub-frontend-psi.vercel.app",
    ],
    credentials: true, // if you need cookies/auth headers
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging and metrics
app.use(requestLogger);
app.use(trackMetrics);

// Root route - Welcome message
app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "DeployHub Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      metrics: "/api/metrics",
    },
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// API routes
app.use("/api/health", healthRoutes);
app.use("/api/metrics", metricsRoutes);

// Handle 404s
app.use((req: Request, res: Response) => {
  logger.warn({ url: req.originalUrl, method: req.method }, "Route not found");
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.originalUrl,
    availableEndpoints: ["/", "/api/health", "/api/metrics"],
  });
});

// Central error handler (must be last)
app.use(errorHandler);

// Print environment configuration in dev mode
if (env.isDevelopment) {
  logEnvConfig();
}

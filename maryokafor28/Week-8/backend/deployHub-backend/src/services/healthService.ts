import { metricsService } from "./metricsService";
import { env } from "../config/env";
import { logger } from "../config/logger";

interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  version: string;
  environment: string;
  metrics?: {
    totalRequests: number;
    totalErrors: number;
    errorRate: string;
    avgResponseTime: string;
  };
  timestamp: string;
}

export const healthService = {
  /**
   * Comprehensive health check with metrics
   */
  check: async (): Promise<HealthCheckResponse> => {
    try {
      const summary = await metricsService.getSummary();

      // Calculate error rate percentage
      const errorRate =
        summary.totalRequests > 0
          ? (summary.totalErrors / summary.totalRequests) * 100
          : 0;

      // Determine health status based on error rate
      let status: "healthy" | "degraded" | "unhealthy" = "healthy";
      if (errorRate > 20) {
        status = "unhealthy";
      } else if (errorRate > 10) {
        status = "degraded";
      }

      return {
        status,
        uptime: Math.floor(process.uptime()),
        version: env.app.version,
        environment: env.nodeEnv,
        metrics: {
          totalRequests: summary.totalRequests,
          totalErrors: summary.totalErrors,
          errorRate: `${errorRate.toFixed(2)}%`,
          avgResponseTime: `${summary.avgResponseTime.toFixed(3)}s`,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      // If metrics service fails, return basic health without metrics
      logger.error(`Failed to fetch metrics in health check: ${error}`);
      return {
        status: "healthy", // Assume healthy if we can't get metrics
        uptime: Math.floor(process.uptime()),
        version: env.app.version,
        environment: env.nodeEnv,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Simple liveness check (for load balancers/K8s)
   */
  isAlive: (): boolean => {
    return process.uptime() > 0;
  },

  /**
   * Readiness check (add DB/external service checks here)
   */
  isReady: async (): Promise<boolean> => {
    return true;
  },
};

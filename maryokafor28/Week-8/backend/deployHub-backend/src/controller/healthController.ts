import { Request, Response, NextFunction } from "express";
import { healthService } from "../services/healthService";
import { logger } from "../config/logger";

export const healthController = {
  /**
   * GET /api/health
   * Comprehensive health check with metrics
   */
  getHealth: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const healthCheck = await healthService.check();

      // Set appropriate HTTP status based on health status
      const httpStatus =
        healthCheck.status === "unhealthy"
          ? 503
          : healthCheck.status === "degraded"
          ? 200
          : 200;

      res.status(httpStatus).json(healthCheck);
    } catch (error) {
      logger.error(`Health check failed:$ { error }`);
      next(error);
    }
  },

  /**
   * GET /api/health/live
   * Liveness probe - checks if app is running
   * Used by load balancers/K8s to know if container is alive
   */
  getLiveness: (_req: Request, res: Response) => {
    const isAlive = healthService.isAlive();

    if (isAlive) {
      res.status(200).json({
        status: "alive",
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: "dead",
        timestamp: new Date().toISOString(),
      });
    }
  },

  /**
   * GET /api/health/ready
   * Readiness probe - checks if app can handle requests
   * Used by load balancers/K8s to know if container is ready for traffic
   */
  getReadiness: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const isReady = await healthService.isReady();

      if (isReady) {
        res.status(200).json({
          status: "ready",
          timestamp: new Date().toISOString(),
        });
      } else {
        res.status(503).json({
          status: "not ready",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      logger.error(`Readiness check failed:$ { error }`);
      next(error);
    }
  },
};

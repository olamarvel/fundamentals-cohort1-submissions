import { Router } from "express";
import { healthController } from "../controller/healthController";

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Comprehensive health check with metrics and status
 * @access  Public
 * @returns Health status with uptime, version, environment, and metrics
 */
router.get("/", healthController.getHealth);

/**
 * @route   GET /api/health/live
 * @desc    Liveness probe - checks if application is running
 * @access  Public
 * @returns Simple alive/dead status
 * @note    Used by load balancers and Kubernetes for container health
 */
router.get("/live", healthController.getLiveness);

/**
 * @route   GET /api/health/ready
 * @desc    Readiness probe - checks if app can handle requests
 * @access  Public
 * @returns Ready/not ready status
 * @note    Used by load balancers and Kubernetes to route traffic
 */
router.get("/ready", healthController.getReadiness);

export default router;

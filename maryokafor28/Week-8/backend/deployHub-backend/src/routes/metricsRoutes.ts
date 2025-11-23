import { Router } from "express";
import { getMetrics, getMetricsSummary } from "../controller/metricsController";

const router = Router();

/**
 * @route   GET /api/metrics
 * @desc    Get raw Prometheus metrics (for scraping)
 * @access  Public
 * @returns Raw metrics in Prometheus format
 */
router.get("/", getMetrics);

/**
 * @route   GET /api/metrics/summary
 * @desc    Get aggregated metrics summary (for frontend dashboard)
 * @access  Public
 * @returns JSON object with metrics summary
 */
router.get("/summary", getMetricsSummary);

export default router;

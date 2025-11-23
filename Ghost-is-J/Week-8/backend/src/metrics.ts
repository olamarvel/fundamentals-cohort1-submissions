import {Counter, Gauge, Histogram, Registry, collectDefaultMetrics} from "prom-client";

const register = new Registry();

// Register default metrics (CPU, memory, GC, event loop lag, etc.)
collectDefaultMetrics({register});

export const requestCounter = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method"] as const,
});

register.registerMetric(requestCounter);

// Error Counter
export const errorCounter = new Counter({
  name: "http_errors_total",
  help: "Total number of HTTP 5xx errors",
  labelNames: ["route"] as const,
});

register.registerMetric(errorCounter);

export const httpRequestDurationSeconds = new Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1, 2, 5], // default buckets
});

register.registerMetric(httpRequestDurationSeconds);

// Uptime Gauge: Tracks service uptime using Node's process.uptime().
export const uptimeGauge = new Gauge({
  name: "service_uptime_seconds",
  help: "Service uptime in seconds",
});

register.registerMetric(uptimeGauge);

// Export registry
export default register;

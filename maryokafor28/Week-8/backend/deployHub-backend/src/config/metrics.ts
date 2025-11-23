import client from "prom-client";
import { env } from "./env";
import { Request, Response, NextFunction } from "express";

export const register = new client.Registry();

// --- Metric Definitions ---
export const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const httpRequestTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

export const httpRequestErrors = new client.Counter({
  name: "http_request_errors_total",
  help: "Total number of HTTP request errors",
  labelNames: ["method", "route", "status_code"],
});

// --- Register Metrics ---
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpRequestErrors);

// --- Default System Metrics ---
if (env.metricsEnabled) {
  client.collectDefaultMetrics({
    register,
    prefix: "deployhub_",
  });
  console.log("📊 Metrics collection enabled");
}

// --- Middleware for tracking requests ---
export const trackMetrics = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    const routePath =
      req.baseUrl + (req.route?.path === "/" ? "" : req.route?.path || "");

    const labels = {
      method: req.method,
      route: routePath || "unknown",
      status_code: res.statusCode.toString(), // Ensure string for prom-client
    };

    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
    if (res.statusCode >= 400) httpRequestErrors.inc(labels);
  });

  next();
};

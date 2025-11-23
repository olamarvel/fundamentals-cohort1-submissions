// src/types/health.ts

export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  uptime: number;
  environment: string;
  version: string;
  metrics: {
    memoryUsage: number;
    cpuUsage: number;
    requestCount: number;
    responseTimeAvg: number;
  };
}

export interface LivenessResponse {
  status: "alive" | "dead";
}

export interface ReadinessResponse {
  status: "ready" | "not_ready";
}

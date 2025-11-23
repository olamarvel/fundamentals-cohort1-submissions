// src/types/metrics.ts

export interface MetricsSummary {
  totalRequests: number;
  averageLatency: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
}

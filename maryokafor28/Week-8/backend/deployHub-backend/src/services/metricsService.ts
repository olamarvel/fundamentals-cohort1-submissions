import {
  register,
  httpRequestErrors,
  httpRequestDuration,
  httpRequestTotal,
} from "../config/metrics";

export interface MetricsSummary {
  totalRequests: number;
  totalErrors: number;
  avgResponseTime: number;
  uptime: number;
  rawMetrics: string;
}

export const metricsService = {
  /**
   * Get aggregated metrics summary
   */
  getSummary: async (): Promise<MetricsSummary> => {
    const metrics = await register.metrics();

    let totalRequests = 0;
    let totalErrors = 0;
    let avgResponseTime = 0;

    try {
      // Get Counter metrics - sum all values across labels
      const requestMetric = await httpRequestTotal.get();
      totalRequests = requestMetric.values.reduce(
        (sum, entry) => sum + entry.value,
        0
      );

      const errorMetric = await httpRequestErrors.get();
      totalErrors = errorMetric.values.reduce(
        (sum, entry) => sum + entry.value,
        0
      );

      // Get Histogram metrics - calculate average from sum/count
      const durationMetric = await httpRequestDuration.get();

      // Find sum and count from histogram values
      const sumEntry = durationMetric.values.find(
        (v) => v.metricName === "http_request_duration_seconds_sum"
      );

      const countEntry = durationMetric.values.find(
        (v) => v.metricName === "http_request_duration_seconds_count"
      );

      const sumValue = sumEntry?.value || 0;
      const countValue = countEntry?.value || 1;

      avgResponseTime = countValue > 0 ? sumValue / countValue : 0;
    } catch (error) {
      // If metric access fails, log and return zeros
      console.error(
        "Failed to fetch metrics:",
        error instanceof Error ? error.message : error
      );
    }

    return {
      totalRequests,
      totalErrors,
      avgResponseTime,
      uptime: process.uptime(), // seconds since process started
      rawMetrics: metrics,
    };
  },

  /**
   * Get raw Prometheus metrics in text format
   * Used by Prometheus scraper or metrics endpoint
   */
  getRawMetrics: async (): Promise<string> => {
    return await register.metrics();
  },

  /**
   * Get metrics content type for Prometheus scraping
   * Returns the proper content-type header value
   */
  getContentType: (): string => {
    return register.contentType;
  },

  /**
   * Reset all metrics (useful for testing)
   */
  reset: (): void => {
    register.resetMetrics();
  },
};

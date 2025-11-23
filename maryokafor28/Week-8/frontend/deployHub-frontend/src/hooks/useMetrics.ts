// src/hooks/useMetrics.ts
import { useEffect, useState } from "react";
import { MetricsAPI } from "../api/metricsApi";
import type { MetricsSummary } from "../types/metrics";

export function useMetrics(autoRefresh: boolean = true, intervalMs = 4000) {
  const [data, setData] = useState<MetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const metrics = await MetricsAPI.getSummary();
      setData(metrics);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("metrics fetch failed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchMetrics();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [autoRefresh, intervalMs]);

  return {
    data,
    loading,
    error,
    refresh: fetchMetrics,
  };
}

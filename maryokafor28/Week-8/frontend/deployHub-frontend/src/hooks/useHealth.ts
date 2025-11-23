// src/hooks/useHealth.ts
import { useEffect, useState } from "react";
import type {
  HealthResponse,
  LivenessResponse,
  ReadinessResponse,
} from "../types/health";
import { HealthAPI } from "../api/healthApi";

export function useHealth(autoRefresh: boolean = true, intervalMs = 5000) {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [liveness, setLiveness] = useState<LivenessResponse | null>(null);
  const [readiness, setReadiness] = useState<ReadinessResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const [healthData, liveData, readyData] = await Promise.all([
        HealthAPI.getHealth(),
        HealthAPI.getLiveness(),
        HealthAPI.getReadiness(),
      ]);

      setData(healthData);
      setLiveness(liveData);
      setReadiness(readyData);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Health fetch failed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();

    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchHealth();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [autoRefresh, intervalMs]);

  return {
    data,
    liveness,
    readiness,
    loading,
    error,
    refresh: fetchHealth,
  };
}

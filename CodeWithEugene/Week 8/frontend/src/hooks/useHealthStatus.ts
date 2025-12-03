import { useCallback, useEffect, useState } from 'react';
import { fetchHealth, fetchStatus } from '../services/api';

interface HealthData {
  status?: string;
  uptime?: number;
  timestamp?: string;
  version?: string;
  environment?: string;
  host?: {
    hostname?: string;
  };
  metrics?: unknown[];
}

interface StatusData {
  version?: string;
  commit?: string;
  releasedAt?: string;
  environment?: string;
}

interface UseStateResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const DEFAULT_REFRESH_INTERVAL = Number(import.meta.env.VITE_HEALTH_REFRESH_MS || 30000);

export const useHealthStatus = () => {
  const [health, setHealth] = useState<UseStateResult<HealthData>>({ data: null, loading: true, error: null });
  const [status, setStatus] = useState<UseStateResult<StatusData>>({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    setHealth((prev) => ({ ...prev, loading: true, error: null }));
    setStatus((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [healthResponse, statusResponse] = await Promise.all([
        fetchHealth(),
        fetchStatus()
      ]);

      setHealth({ data: healthResponse, loading: false, error: null });
      setStatus({ data: statusResponse, loading: false, error: null });
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setHealth({ data: null, loading: false, error: err });
      setStatus({ data: null, loading: false, error: err });
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, DEFAULT_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [load]);

  return {
    health,
    status,
    refresh: load
  };
};










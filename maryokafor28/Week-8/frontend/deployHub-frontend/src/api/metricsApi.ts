// src/api/metricsApi.ts
import type { MetricsSummary } from "../types/metrics";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText}`);
  }

  return res.json() as Promise<T>;
}

export const MetricsAPI = {
  getSummary: () => request<MetricsSummary>("/api/metrics/summary"),
};

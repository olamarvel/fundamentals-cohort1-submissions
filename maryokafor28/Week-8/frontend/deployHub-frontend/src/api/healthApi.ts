// src/api/healthApi.ts
import type {
  HealthResponse,
  LivenessResponse,
  ReadinessResponse,
} from "../types/health";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error ${res.status}: ${errorText}`);
  }

  return res.json() as Promise<T>;
}

export const HealthAPI = {
  getHealth: () => request<HealthResponse>("/api/health"),
  getLiveness: () => request<LivenessResponse>("/api/health/live"),
  getReadiness: () => request<ReadinessResponse>("/api/health/ready"),
};

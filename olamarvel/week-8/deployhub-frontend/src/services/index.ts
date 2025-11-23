
import axios from '@/lib/axios';
import type { HealthCheckResponse } from '@/lib/type';

/**
 * Hits the backend health-check endpoint.
 * @returns server health status
 */
export const healthCheck = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await axios.get<HealthCheckResponse>('/health-check');
    return response.data;
  } catch (error: any) {
    console.error('Health check failed:', error.response?.data || error.message);
    return {
      status: 'down',
      uptime: 0,
      version: 'unknown',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    };
  }
};

  
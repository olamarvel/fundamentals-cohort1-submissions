
export interface HistogramBucket {
  value: number;
  metricName: string;
  labels: {
    le?: string;
  };
}

export interface Histogram {
  name: string;
  help: string;
  type: string;
  values: HistogramBucket[];
}

export  interface HealthResponse {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
  service: string;
  totalRequests: number;
  errorRate: number;
  responseTimeHistogram: Histogram;
}

export interface RequestHistoryPoint {
  time: string;
  totalRequests: number;
}

export type Health = {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
  service?: string;
  totalRequests: string;
  errorRate: number;
  avgResponseTime: string;
};

export type Service = {
  _id?: string;
  name: string;
  url: string;
  version?: string;
  status?: string;
  createdAt?: string;
};


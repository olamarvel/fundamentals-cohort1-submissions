import { Request, Response } from 'express';
import os from 'node:os';
import packageJson from '../../package.json';
import { register } from '../metrics/metrics';

interface HealthPayload {
  status: string;
  uptime: number;
  timestamp: string;
  version: string;
  environment: string;
  host: {
    hostname: string;
    platform: string;
    release: string;
  };
  resources: {
    memory: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
    cpuLoad: number[];
  };
  metrics: unknown[];
}

const buildHealthPayload = async (): Promise<HealthPayload> => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  const metrics = await register.getMetricsAsJSON();

  return {
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString(),
    version: packageJson.version,
    environment: process.env.NODE_ENV || 'development',
    host: {
      hostname: os.hostname(),
      platform: os.platform(),
      release: os.release()
    },
    resources: {
      memory: {
        rss: memoryUsage.rss,
        heapTotal: memoryUsage.heapTotal,
        heapUsed: memoryUsage.heapUsed
      },
      cpuLoad: os.loadavg()
    },
    metrics
  };
};

export const getHealth = async (req: Request, res: Response): Promise<void> => {
  const payload = await buildHealthPayload();
  res.json(payload);
};










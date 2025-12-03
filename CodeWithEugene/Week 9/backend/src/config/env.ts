import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  legacyApiBaseUrl: process.env.LEGACY_API_BASE_URL || 'https://jsonplaceholder.typicode.com',
  cacheTtl: parseInt(process.env.CACHE_TTL || '300', 10),
  maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
  retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '1000', 10),
  apiTimeoutMs: parseInt(process.env.API_TIMEOUT_MS || '5000', 10),
};



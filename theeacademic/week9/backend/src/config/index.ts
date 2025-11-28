import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  legacyApiUrl: process.env.LEGACY_API_URL || 'https://jsonplaceholder.typicode.com',
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '300'), // 5 minutes
    checkperiod: parseInt(process.env.CACHE_CHECK_PERIOD || '60'), // 1 minute
  },
  retry: {
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    baseDelay: parseInt(process.env.BASE_DELAY || '1000'), // 1 second
    maxDelay: parseInt(process.env.MAX_DELAY || '10000'), // 10 seconds
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  },
};
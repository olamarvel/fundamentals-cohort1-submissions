export const LEGACY_API_URL = process.env.LEGACY_API_URL || 'http://localhost:4000';
export const PORT = Number(process.env.PORT || 3000);
export const CACHE_TTL = Number(process.env.CACHE_TTL || 60); // seconds
export const USE_REDIS = process.env.USE_REDIS === 'true';
export const REDIS_URL = process.env.REDIS_URL || '';
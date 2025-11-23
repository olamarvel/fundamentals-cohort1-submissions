import NodeCache from "node-cache";

const CACHE_TTL = Number(process.env.CACHE_TTL || 60);
const cache = new NodeCache({ stdTTL: CACHE_TTL });

export function getCached<T>(key: string): T | undefined {
  return cache.get<T>(key);
}
export function setCached<T>(key: string, value: T) {
  cache.set(key, value);
}
export function delCached(key: string) {
  cache.del(key);
}
export function flushCache() {
  cache.flushAll();
}
export function cacheStats() {
  return cache.getStats();
}

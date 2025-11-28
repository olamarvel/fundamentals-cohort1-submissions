import NodeCache from 'node-cache';
import { config } from '../config';
import { CacheConfig } from '../types';

class CacheService {
  private cache: NodeCache;

  constructor(cacheConfig: CacheConfig = config.cache) {
    this.cache = new NodeCache({
      stdTTL: cacheConfig.ttl,
      checkperiod: cacheConfig.checkperiod,
    });
  }

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 0);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }

  keys(): string[] {
    return this.cache.keys();
  }
}

export const cacheService = new CacheService();
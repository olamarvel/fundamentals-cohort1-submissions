import NodeCache from "node-cache";

class Cache {
  private cache = new NodeCache({
    stdTTL: 600,
    checkperiod: 120,
  });

  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set(key, value, ttl || 600);
  }

  del(key: string): number {
    return this.cache.del(key);
  }

  flush(): void {
    this.cache.flushAll();
  }
}

export const cache = new Cache();

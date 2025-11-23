// simple in-memory cache. Swap this out for Redis-backed implementation if needed.


type CacheEntry = { value: any; expiresAt: number };
const store = new Map<string, CacheEntry>();


export function getCached<T>(key: string): T | null {
const e = store.get(key);
if (!e) return null;
if (Date.now() > e.expiresAt) { store.delete(key); return null; }
return e.value as T;
}


export function setCached(key: string, value: any, ttlSec: number) {
store.set(key, { value, expiresAt: Date.now() + ttlSec * 1000 });
}


export function delCached(key: string) {
store.delete(key);
}
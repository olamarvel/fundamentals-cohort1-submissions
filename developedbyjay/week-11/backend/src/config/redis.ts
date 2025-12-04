import Redis from "ioredis";

export let redis: Redis;

export async function connectRedis() {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  redis = new Redis(url);
  await redis.ping();
  console.log("Redis connected");
}


import { redis } from "../config/redis.ts";
import { PartnerConfigModel } from "../models/partner-config.ts";

export async function getPartnerConfig(partner: string) {
  const key = `partner:${partner}:config`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  const config = await PartnerConfigModel.findOne({ partner }).lean();
  if (config) await redis.set(key, JSON.stringify(config), "EX", 300);
  return config;
}

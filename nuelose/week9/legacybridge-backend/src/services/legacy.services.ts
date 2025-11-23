import axios from "axios";
import axiosRetry from "axios-retry";
import { LegacyUser, LegacyPost } from "../types/legacy.types";
import { Customer, Payment } from "../types/v2.types";
import { cache } from "../utils/cache.utils";

const LEGACY_API_BASE_URL = `http://127.0.0.1:${process.env.PORT || 3000}`;

const getAxiosInstance = () => {
  const instance = axios.create({
    baseURL: LEGACY_API_BASE_URL,
    timeout: 5000,
  });

  axiosRetry(instance, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000,
    retryCondition: (error) =>
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === "ECONNABORTED",
  });

  return instance;
};

export class LegacyService {
  static async getCustomers(): Promise<Customer[]> {
    const cacheKey = "customers_v1";
    const cached = cache.get<Customer[]>(cacheKey);
    if (cached) {
      console.log("Cache HIT - customers");
      return cached;
    }

    try {
      const response = await getAxiosInstance().get<LegacyUser[]>(
        "/api/users.php"
      );

      const transformed: Customer[] = (response.data ?? []).map((user) => ({
        id: user.id,
        fullName: user.name ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        companyName: user.company?.name ?? "",
        status: user.id % 10 === 0 ? "suspended" : "active",
        registeredAt: new Date(
          Date.now() - Math.random() * 10_000_000_000
        ).toISOString(),
      }));

      cache.set(cacheKey, transformed, 600);
      return transformed;
    } catch (error: any) {
      if (cached) {
        console.warn("Legacy API down – serving stale customers from cache");
        return cached;
      }
      throw new Error("Legacy customer system unavailable and no cache");
    }
  }

  static async getPayments(): Promise<Payment[]> {
    const cacheKey = "payments_v1";
    const cached = cache.get<Payment[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await getAxiosInstance().get<LegacyPost[]>(
        "/api/posts.php"
      );

      const transformed: Payment[] = (response.data ?? []).map((post) => {
        const title = post.title ?? "";
        const body = post.body ?? "";
        const rawAmount = post.amount ?? 0;

        const isRefund = title.toLowerCase().includes("refund");
        const amount = isRefund ? -Math.abs(rawAmount) : rawAmount;

        return {
          id: post.id,
          customerId: post.userId,
          title,
          description: body,
          amount: Number(amount.toFixed(2)),
          currency: "NGN",
          status: isRefund ? "refunded" : "completed",
          processedAt: new Date(
            Date.now() - Math.random() * 10_000_000_000
          ).toISOString(),
        };
      });

      cache.set(cacheKey, transformed);
      return transformed;
    } catch (error: any) {
      if (cached) {
        console.warn("Legacy API down – serving stale payments");
        return cached;
      }
      throw new Error("Legacy payment system unavailable");
    }
  }
}

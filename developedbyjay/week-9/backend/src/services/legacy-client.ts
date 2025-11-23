import axios from "axios";
import pRetry from "p-retry";

const LEGACY_BASE = process.env.LEGACY_BASE || "http://localhost:4001";

const axiosInstance = axios.create({
  baseURL: LEGACY_BASE,
  timeout: 4000,
});

async function getWithRetry<T>(url: string): Promise<T[]> {
  return pRetry(
    async () => {
      const resp = await axiosInstance.get<T[]>(url);
      return resp.data;
    },
    {
      retries: 2,
      onFailedAttempt: (err) => {
        console.warn(
          `Attempt ${err.attemptNumber} failed. ${err.retriesLeft} retries left.`
        );
      },
    }
  );
}

// Adapter pattern to wrap legacy API
export const LegacyClient: {
  getPayments: () => Promise<any[]>;
  getCustomers: () => Promise<any[]>;
} = {
  getPayments: () => getWithRetry<any[]>("/legacy/payments"),
  getCustomers: () => getWithRetry<any[]>("/legacy/customers"),
};

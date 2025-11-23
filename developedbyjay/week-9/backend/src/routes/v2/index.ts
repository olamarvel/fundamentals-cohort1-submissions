import express from "express";
import { LegacyClient } from "../../services/legacy-client";
import { transformPayment, transformCustomer } from "../../services/transform";
import { getCached, setCached } from "../../services/cache";
const router = express.Router();

router.get("/payments", async (req, res) => {
  try {
    const cacheKey = "v2:payments";
    const cached = getCached<any[]>(cacheKey);
    if (cached) return res.json({ fromCache: true, data: cached });

    const legacy = await LegacyClient.getPayments();
    const transformed = legacy.map(transformPayment);
    setCached(cacheKey, transformed);
    res.json({ fromCache: false, data: transformed });
  } catch (err: any) {
    console.error("Failed to fetch/transform payments:", err.message || err);
    return res
      .status(502)
      .json({ error: "Bad Gateway: failed to retrieve legacy payments" });
  }
});

router.get("/customers", async (_, res) => {
  try {
    const cacheKey = "v2:customers";
    const cached = getCached<any[]>(cacheKey);
    if (cached) return res.json({ fromCache: true, data: cached });

    const legacy = await LegacyClient.getCustomers();
    const transformed = legacy.map(transformCustomer);
    setCached(cacheKey, transformed);
    res.json({ fromCache: false, data: transformed });
  } catch (err: any) {
    console.error(err);
    return res
      .status(502)
      .json({ error: "Bad Gateway: failed to retrieve legacy customers" });
  }
});

export default router;

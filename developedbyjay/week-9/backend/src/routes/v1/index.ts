import express from "express";
import axios from "axios";

const router = express.Router();

const LEGACY_BASE = process.env.LEGACY_BASE || "http://localhost:4001";

router.get("/payments", async (req, res) => {
  try {
    const r = await axios.get(`${LEGACY_BASE}/legacy/payments`, {
      timeout: 4000,
    });
    res.json(r.data);
  } catch (err: any) {
    console.error("v1 passthrough failed", err.message || err);
    res.status(502).json({ error: "Legacy service unavailable" });
  }
});

router.get("/customers", async (req, res) => {
  try {
    const r = await axios.get(`${LEGACY_BASE}/legacy/customers`, {
      timeout: 4000,
    });
    res.json(r.data);
  } catch (err: any) {
    console.error("v1 passthrough failed", err.message || err);
    res.status(502).json({ error: "Legacy service unavailable" });
  }
});

export default router;

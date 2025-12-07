import { Router } from "express";
import { authMiddleware } from "../middleware/auth.ts";
import { getTransactions, postTransaction } from "../controllers/transaction.ts";

const router = Router();


router.get("/transactions", authMiddleware, getTransactions);
router.post("/transactions", authMiddleware, postTransaction);

export default router;

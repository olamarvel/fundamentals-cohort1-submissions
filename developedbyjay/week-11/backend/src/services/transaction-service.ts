import { TransactionModel } from "../models/transaction.ts";
import { Conflict, NotFound } from "../utils/error.ts";

export async function createTransaction(payload: any) {
  const { idempotencyKey } = payload;
  if (!idempotencyKey) throw Conflict("Missing idempotencyKey");
  const existing = await TransactionModel.findOne({ idempotencyKey });
  if (existing) return existing;
  const newTransaction = await TransactionModel.create(payload);
  return newTransaction;
}

export async function listTransactions(partner: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  const items = await TransactionModel.find({ partner })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  return { items, page, limit };
}

export async function getTransactionById(id: string) {
  const tx = await TransactionModel.findById(id).lean();
  if (!tx) throw NotFound("Transaction not found");
  return tx;
}

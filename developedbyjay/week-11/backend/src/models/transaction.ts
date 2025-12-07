import mongoose, { Schema, InferSchemaType } from 'mongoose';

const TransactionSchema = new Schema({
  idempotencyKey: { type: String, index: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, default: 'pending' },
  customer: { type: Object, required: true }, 
  partner: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

export type Transaction = InferSchemaType<typeof TransactionSchema>;
export const TransactionModel = mongoose.model('Transaction', TransactionSchema);

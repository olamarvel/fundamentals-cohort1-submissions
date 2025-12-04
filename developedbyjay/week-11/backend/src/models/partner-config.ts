import mongoose, { Schema } from "mongoose";

const PartnerConfigSchema = new Schema(
  {
    partner: { type: String, unique: true },
    fees: { type: Number, default: 0 },
    allowedCurrencies: { type: [String], default: ["USD", "NGN", "EUR"] },
  },
  { strict: true }
);

export const PartnerConfigModel = mongoose.model(
  "PartnerConfig",
  PartnerConfigSchema
);

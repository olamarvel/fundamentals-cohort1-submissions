import { Request, Response } from "express";
import Joi from "joi";

import { getPartnerConfig } from "../services/partner-service.ts";
import {
  createTransaction,
  listTransactions,
} from "../services/transaction-service.ts";

const createSchema = Joi.object({
  idempotencyKey: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().required(),
  customer: Joi.object().required(),
  partner: Joi.string().required(),
});

export async function postTransaction(req: Request, res: Response) {
  const { error, value } = createSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ error: { code: "VALIDATION_ERROR", message: error.message } });

  const config = await getPartnerConfig(value.partner);
  if (!config || !config.allowedCurrencies.includes(value.currency)) {
    return res.status(400).json({
      error: {
        code: "INVALID_CURRENCY",
        message: "Currency not allowed for partner",
      },
    });
  }
  const transaction = await createTransaction(value);
  res.status(201).json(transaction);
}

export async function getTransactions(req: Request, res: Response) {
  const partner = (req.query.partner as string) || "default";
  const page = parseInt((req.query.page as string) || "1", 10);
  const limit = parseInt((req.query.limit as string) || "10", 10);
  const data = await listTransactions(partner, page, limit);
  const config = await getPartnerConfig(partner);
  res.json({ ...data, partnerConfig: config });
}

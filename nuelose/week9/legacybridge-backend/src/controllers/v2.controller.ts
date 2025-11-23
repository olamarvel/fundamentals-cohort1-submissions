import { Request, Response } from "express";
import { LegacyService } from "../services/legacy.services";

export class V2Controller {
  static async getCustomers(req: Request, res: Response) {
    const customers = await LegacyService.getCustomers();
    res.json({
      data: customers,
      meta: { count: customers.length, source: "v2-bridge", cached: true },
    });
  }

  static async getPayments(req: Request, res: Response) {
    const payments = await LegacyService.getPayments();
    res.json({
      data: payments,
      meta: { count: payments.length, source: "v2-bridge" },
    });
  }
}

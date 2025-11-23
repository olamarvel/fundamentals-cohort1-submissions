import { Router } from "express";
import { V2Controller } from "../controllers/v2.controller";

const router = Router();

router.get("/customers", V2Controller.getCustomers);
router.get("/payments", V2Controller.getPayments);

export default router;

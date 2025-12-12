import { Router } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { notify } from "../controllers/notifyController";

const router = Router();

router.post("/notify", asyncWrapper(notify));
export default router;

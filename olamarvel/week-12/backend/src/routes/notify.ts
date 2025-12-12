import { Router } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { notify, status } from "../controllers/notifyController";

const router = Router();

router.post("/notify", asyncWrapper(notify));
router.get("/status/:jobId", asyncWrapper(status));
export default router;

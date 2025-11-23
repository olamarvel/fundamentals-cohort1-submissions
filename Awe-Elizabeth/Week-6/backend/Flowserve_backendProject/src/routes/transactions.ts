import { Router } from "express";
import { TransactionController} from "../controllers/transactions";
import { auth } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/utilityFunctions";

const router = Router();

router.post('/transfer', auth, asyncHandler(TransactionController.transferMoney));
router.post('/deposit', auth, asyncHandler(TransactionController.depositMoney));
router.post('/withdraw', auth, asyncHandler(TransactionController.withdrawMoney));




export default router
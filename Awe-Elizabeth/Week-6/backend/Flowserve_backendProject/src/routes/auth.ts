import { Router } from "express";
import { AuthController} from "../controllers/auth";
import { auth } from "../middleware/authMiddleware";
import { asyncHandler } from "../utils/utilityFunctions";

const router = Router();

router.post('/register', asyncHandler(AuthController.register));
router.post('/login', asyncHandler(AuthController.login));
// router.post('/refresh', refresh);
// router.get('/logout',auth, logout);

export default router
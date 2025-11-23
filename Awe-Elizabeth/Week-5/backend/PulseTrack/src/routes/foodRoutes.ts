import { Router } from "express";
import { getFood } from "../controllers/foodController";
import { auth, authorize } from "../middleware/authMiddleware";
import { UserRoles } from "../utilities/enums/UserRole";

const router = Router();

router.get('/', auth,authorize(UserRoles.User, UserRoles.Admin), getFood);

export default router
import { Router } from "express";
import { GetUserMeals, createMeal } from "../controllers/mealController";
import { auth, authorize } from "../middleware/authMiddleware";
import { UserRoles } from "../utilities/enums/UserRole";

const router = Router();

router.get('/', auth,authorize(UserRoles.User, UserRoles.Admin), GetUserMeals);
router.post('/', auth, authorize(UserRoles.User, UserRoles.Admin), createMeal);
//router.post('/search', auth, authorize(UserRoles.User, UserRoles.Admin), searchTasks);

export default router
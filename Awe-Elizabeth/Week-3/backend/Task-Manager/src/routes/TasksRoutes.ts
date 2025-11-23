import { Router } from "express";
import { getTasks, createTask, searchTasks } from "../controllers/tasksController";
import { auth, authorize } from "../middleware/authMiddleware";
import { UserRoles } from "../utilities/enums/UserRole";

const router = Router();

router.get('/', auth,authorize(UserRoles.User, UserRoles.Admin), getTasks);
router.post('/', auth, authorize(UserRoles.User, UserRoles.Admin), createTask);
router.post('/search', auth, authorize(UserRoles.User, UserRoles.Admin), searchTasks);

export default router
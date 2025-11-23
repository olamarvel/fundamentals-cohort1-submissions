import { Router } from "express";
import { getPostComments, addComment } from "../controllers/commentContoller";
import { auth, authorize } from "../middleware/authMiddleware";
import { UserRoles } from "../utilities/enums/UserRole";

const router = Router();

router.get('/', auth,authorize(UserRoles.User, UserRoles.Admin), getPostComments);
router.post('/', auth, authorize(UserRoles.User, UserRoles.Admin), addComment);
//router.post('/search', auth, authorize(UserRoles.User, UserRoles.Admin), searchTasks);

export default router
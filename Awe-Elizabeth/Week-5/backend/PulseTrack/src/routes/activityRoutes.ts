import { Router } from "express";
import { auth, authorize } from "../middleware/authMiddleware";
import { UserRoles } from "../utilities/enums/UserRole";
import { addActivity, getAllUserActivities, updateActivity } from "../controllers/activitiesContoller";


const router = Router();

router.get('/user', auth,authorize(UserRoles.User, UserRoles.Admin), getAllUserActivities);
router.put('/:activityId', auth,authorize(UserRoles.User, UserRoles.Admin), updateActivity);
router.post('/', auth, authorize(UserRoles.User, UserRoles.Admin), addActivity);
//router.post('/search', auth, authorize(UserRoles.User, UserRoles.Admin), searchTasks);

export default router
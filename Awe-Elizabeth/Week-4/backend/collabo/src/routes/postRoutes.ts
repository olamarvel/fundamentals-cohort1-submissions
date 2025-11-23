import { Router } from "express";
import { getPosts, createPost, getUserPosts } from "../controllers/postController";
import { auth, authorize } from "../middleware/authMiddleware";
import { UserRoles } from "../utilities/enums/UserRole";

const router = Router();

router.get('/user', auth,authorize(UserRoles.User, UserRoles.Admin), getUserPosts);
router.get('/', auth,authorize(UserRoles.User, UserRoles.Admin), getPosts);
router.post('/', auth, authorize(UserRoles.User, UserRoles.Admin), createPost);
//router.post('/search', auth, authorize(UserRoles.User, UserRoles.Admin), searchTasks);

export default router
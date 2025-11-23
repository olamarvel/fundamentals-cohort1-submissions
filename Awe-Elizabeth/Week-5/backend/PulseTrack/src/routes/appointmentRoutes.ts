import { Router } from "express";
import { auth, authorize } from "../middleware/authMiddleware";
import { UserRoles } from "../utilities/enums/UserRole";
import { GetUserAppointments, createAppointment, updateAppointment } from "../controllers/appointmentController";


const router = Router();

router.get('/user', auth,authorize(UserRoles.User, UserRoles.Admin), GetUserAppointments);
router.put('/:appointmentId', auth,authorize(UserRoles.User, UserRoles.Admin), updateAppointment);
router.post('/', auth, authorize(UserRoles.User, UserRoles.Admin), createAppointment);

export default router